import { Request, Response } from "express";
import Tweet from "../models/tweet.model";

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

    // Build base tweet data
    const tweetData: any = {
      title,
      content,
      type,
      author: req.userId,
    };

    // Add classroom only if provided
    if (classroomId) {
      tweetData.classroom = classroomId;
    }

    // Create and save tweet
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
      return res.status(403).json({ error: "Not allowed" });
    }

    await tweet.deleteOne();

    res.status(200).json({ success: true, message: "Tweet deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting tweet" });
  }
};
