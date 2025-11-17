import { Request, Response } from "express";
import Tweet from "../models/tweet.model";
import { cloudinary } from "../lib/cloudinary";

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
    const { title, content, type, classroomId } = req.body;

    const tweetData: any = {
      title,
      content,
      type,
      author: req.userId,
    };

    if (classroomId) {
      tweetData.classroom = classroomId;
    }

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
      .populate("classroom", "title")
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
      .populate("author", "username")
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
      (id: any) => id.toString() === userId
    );

    if (alreadyLiked) {
      // Remove like
      tweet.likes = tweet.likes.filter((id: any) => id.toString() !== userId);
    } else {
      // Add like
      tweet.likes.push(userId);
    }

    await tweet.save();

    return res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likesCount: tweet.likes.length,
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

    const { content } = req.body;

    const repost = await Tweet.create({
      title: content, 
      type: "repost",
      author: req.userId,
      parentTweet: originalTweet._id, // link to original
    });
    // const repost = await Tweet.create({
    //   title: originalTweet.title, 
    //   content: content || "", // optional commentary
    //   type: "repost",
    //   author: req.userId,
    //   parentTweet: originalTweet._id, // link to original
    // });

    return res.status(201).json({
      success: true,
      message: "Tweet reposted successfully",
      data: repost,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to repost tweet" });
  }
};
