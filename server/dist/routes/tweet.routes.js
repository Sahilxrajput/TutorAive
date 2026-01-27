"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tweet_controller_1 = require("../controllers/tweet.controller");
const tweet_validator_1 = require("../validators/tweet.validator");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const cloudinary_1 = require("../lib/cloudinary");
const router = express_1.default.Router();
// All posts
router.get("/", tweet_controller_1.getAllTweets);
router.use(auth_middleware_1.default);
// Create post
router.post("/", cloudinary_1.upload.single("image"), tweet_controller_1.createTweet);
// router.post("/", createTweetValidator, handleValidation, upload.single("image"), createTweet);
// Single post
router.get("/:id", tweet_validator_1.tweetIdValidator, tweet_controller_1.getTweetById);
//repost
router.post("/:id/repost", tweet_validator_1.tweetIdValidator, tweet_controller_1.repostTweet);
//like tweet
router.put("/:id/toggle-like", tweet_validator_1.tweetIdValidator, tweet_controller_1.toggleLikeTweet);
// Delete post
router.delete("/:id", tweet_validator_1.tweetIdValidator, tweet_controller_1.deleteTweet);
exports.default = router;
