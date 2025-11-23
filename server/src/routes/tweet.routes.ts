import express from "express";
import {
  createTweet,
  getAllTweets,
  getTweetById,
  deleteTweet,
  toggleLikeTweet,
  repostTweet,
} from "../controllers/tweet.controller";

import {
  createTweetValidator,
  tweetIdValidator,
} from "../validators/tweet.validator";
import authMiddleware from "../Middlewares/auth.middleware";
import { upload } from "../lib/cloudinary";

const router = express.Router();

// All posts
router.get("/", getAllTweets);

router.use(authMiddleware);

// Create post
router.post("/", createTweetValidator, upload.single("image"), createTweet);

// Single post
router.get("/:id", tweetIdValidator, getTweetById);

//repost
router.post("/:id/repost", tweetIdValidator, repostTweet);

//like tweet
router.put("/:id/toggle-like", tweetIdValidator, toggleLikeTweet);

// Delete post
router.delete("/:id", tweetIdValidator, deleteTweet);

export default router;
