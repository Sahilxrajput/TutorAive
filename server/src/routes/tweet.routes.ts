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
import authMiddleware from "../middlewares/auth.middleware";
import { upload } from "../lib/cloudinary";
import { handleValidation } from "../middlewares/handleValidation";

const router = express.Router();

// All posts
router.get("/", getAllTweets);

router.use(authMiddleware);

// Create post
router.post("/", upload.single("image"), createTweet);
// router.post("/", createTweetValidator, handleValidation, upload.single("image"), createTweet);

// Single post
router.get("/:id", tweetIdValidator, getTweetById);

//repost
router.post("/:id/repost", tweetIdValidator, repostTweet);

//like tweet
router.put("/:id/toggle-like", tweetIdValidator, toggleLikeTweet);

// Delete post
router.delete("/:id", tweetIdValidator, deleteTweet);

export default router;
