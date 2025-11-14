import express from "express";
import {
  createTweet,
  getAllTweets,
  getTweetById,
  deleteTweet,
} from "../controllers/tweet.controller";

import {
  createTweetValidator,
  tweetIdValidator,
} from "../validators/tweet.validator";
import authMiddleware from "../Middlewares/auth.middleware";

// ? @remind retweet, likes and comment
const router = express.Router();

// All posts
router.get("/",  getAllTweets);

router.use(authMiddleware)

// Create post
router.post("/", createTweetValidator, createTweet);

// Single post
router.get("/:id", tweetIdValidator, getTweetById);

// Delete post
router.delete("/:id", tweetIdValidator, deleteTweet);

export default router;
