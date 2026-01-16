import { Request, Response } from "express";
import Tweet from "../models/tweet.model";
import { cloudinary } from "../lib/cloudinary";
import { emitTweetNotification } from "../sockets/emitters/notification.emitter";
import { extractMentionedUserIds } from "../utils/extractMentionIds";
import { Types } from "mongoose";
import { Notification } from "../models/notification.model";
import { ITweetNotificationJob } from "../types/type";
import { addTweetNotificationJob } from "../redis/queue";

const handleError = (
  res: Response,
  error: any,
  defaultMessage: string = "Internal Server Error",
  statusCode: number = 500
) => {
  console.error(error); // Log the detailed error for debugging
  return res.status(statusCode).json({
    success: false,
    error: error?.message || defaultMessage,
    message: defaultMessage,
  });
};

export const createTweet = async (req: Request, res: Response) => {
  try {
    const { content, type } = req.body;

    const mentionedUserIds = await extractMentionedUserIds(
      content,
      req.userId!
    );

    const tweetData: any = {
      content,
      type,
      author: req.userId,
      mentions: mentionedUserIds,
    };

    // Validate file type
    if (
      req.file &&
      !["image/png", "image/jpeg", "image/jpg"].includes(req.file.mimetype)
    ) {
      return res.status(400).json({ error: "Invalid file type" });
    }

    // Upload file if exists
    let uploadResult: any = null;

    if (req.file) {
      uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "tweets" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(req?.file?.buffer);
      });

      tweetData.image = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    // Create tweet
    const tweet = new Tweet(tweetData);
    await tweet.save();

    console.log("tweet", tweet);

    if (mentionedUserIds.length > 0) {
      for (const mentionId of mentionedUserIds) {
        await addTweetNotificationJob({
          userId: mentionId.toString(),
          tweetId: tweet._id.toString(),
          actorName: req.userName ?? "someone",
          action: "mention",
        });
      }
    }

    // emitTweetNotification({
    //   userId: mentionId.toString(),
    //   tweetId: tweet._id.toString(),
    //   msg: `${req.userName} mentioned you in a post`,
    // });

    // Persist Notifications in Bulk (Tweet Mentions)
    //   const notificationDocs = mentionedUserIds.map(
    //     (userId: Types.ObjectId) => ({
    //       user: userId,
    //       type: "message", // correct semantic type
    //       message: `You were mentioned in a tweet`,
    //       data: {
    //         tweetId: tweet._id,
    //       },
    //     })
    //   );

    //   if (notificationDocs.length > 0) {
    //     await Notification.insertMany(notificationDocs);
    //   }
    // }

    return res.status(201).json({
      success: true,
      message: "Tweet posted successfully",
      data: tweet,
    });
  } catch (error) {
    handleError(res, error, "Failed to create Tweet.");
  }
};

export const getAllTweets = async (req: Request, res: Response) => {
  try {
    const tweets = await Tweet.find()
      .populate("author", {
        userName: 1,
        profilePicture: 1,
        firstName: 1,
        lastName: 1,
        role: 1,
      })
      .populate({
        path: "parentTweet",
        populate: {
          path: "author",
          select: "userName firstName lastName profilePicture role",
        },
      })
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ message: "Get All Tweets successfully", data: tweets });
  } catch (error) {
    handleError(res, error, "failed to fetch craeted tweets");
  }
};

export const getTweetById = async (req: Request, res: Response) => {
  try {
    const tweet = await Tweet.findById(req.params.id)
      .populate("author", "userName")
      .populate("classroom", "title");
    //   .populate("book", "title")
    //   .populate("problemId", "title");

    if (!tweet) return res.status(404).json({ error: "Tweet not found" });

    res.status(200).json({ data: tweet, message: "Get single tweet" });
  } catch (error) {
    handleError(res, error, "Failed to fetch single tweet");
  }
};

export const deleteTweet = async (req: Request, res: Response) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) return res.status(404).json({ error: "Tweet not found" });

    if (tweet.author.toString() !== req.userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this tweet" });
    }

    // Delete Cloudinary image if exists
    if (tweet?.image?.public_id) {
      await cloudinary.uploader.destroy(tweet.image.public_id);
    }

    await Tweet.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Tweet deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting tweet" });
  }
};

export const toggleLikeTweet = async (req: Request, res: Response) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    const userId = req.userId;

    // Convert all like IDs to string & check toggle state
    const alreadyLiked = tweet.likes.some(
      (id: Types.ObjectId) => id.toString() === userId
    );

    if (alreadyLiked) {
      // Remove like
      tweet.likes = tweet.likes.filter(
        (id: Types.ObjectId) => id.toString() !== userId
      );
    } else {
      // Add like
      tweet.likes.push(userId);

      // Notify tweet author (only if not self-like)
      if (tweet.author.toString() !== userId) {
        addTweetNotificationJob({
          actorName: req.userName ?? "someone",
          userId: tweet.author.toString(),
          tweetId: tweet._id.toString(),
          action: "like",
        });
      }
    }

    const updatedTweets = await tweet.save();

    return res.status(200).json({
      success: true,
      data: updatedTweets,
      message: alreadyLiked ? "Tweet unliked" : "Tweet liked",
    });
  } catch (error: any) {
    console.error(error);
    return handleError(res, error, "Failed to like/unlike tweet");
  }
};

export const repostTweet = async (req: Request, res: Response) => {
  try {
    const originalTweet = await Tweet.findById(req.params.id);

    if (!originalTweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    const repost = await Tweet.create({
      type: req.body.type || "general",
      author: req.userId,
      parentTweet: originalTweet._id,
      content: req.body.content?.trim() ?? undefined,
    });

    // Notify original author (if not self)
    if (originalTweet.author.toString() !== req.userId) {
      addTweetNotificationJob({
        actorName: req.userName ?? "someone",
        userId: originalTweet.author.toString(),
        tweetId: originalTweet._id.toString(),
        action: "repost",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Tweet reposted successfully",
      data: repost,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to repost tweet" });
  }
};
