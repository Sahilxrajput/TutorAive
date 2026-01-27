"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.repostTweet = exports.toggleLikeTweet = exports.deleteTweet = exports.getTweetById = exports.getAllTweets = exports.createTweet = void 0;
const tweet_model_1 = __importDefault(require("../models/tweet.model"));
const cloudinary_1 = require("../lib/cloudinary");
const extractMentionIds_1 = require("../utils/extractMentionIds");
const queue_1 = require("../redis/queue");
const handleError = (res, error, defaultMessage = "Internal Server Error", statusCode = 500) => {
    console.error(error); // Log the detailed error for debugging
    return res.status(statusCode).json({
        success: false,
        error: (error === null || error === void 0 ? void 0 : error.message) || defaultMessage,
        message: defaultMessage,
    });
};
const createTweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { content, type } = req.body;
        const mentionedUserIds = yield (0, extractMentionIds_1.extractMentionedUserIds)(content, req.userId);
        const tweetData = {
            content,
            type,
            author: req.userId,
            mentions: mentionedUserIds,
        };
        // Validate file type
        if (req.file &&
            !["image/png", "image/jpeg", "image/jpg"].includes(req.file.mimetype)) {
            return res.status(400).json({ error: "Invalid file type" });
        }
        // Upload file if exists
        let uploadResult = null;
        if (req.file) {
            uploadResult = yield new Promise((resolve, reject) => {
                var _a;
                const stream = cloudinary_1.cloudinary.uploader.upload_stream({ folder: "tweets" }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                stream.end((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.buffer);
            });
            tweetData.image = {
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
            };
        }
        // Create tweet
        const tweet = new tweet_model_1.default(tweetData);
        yield tweet.save();
        console.log("tweet", tweet);
        if (mentionedUserIds.length > 0) {
            for (const mentionId of mentionedUserIds) {
                yield (0, queue_1.addTweetNotificationJob)({
                    userId: mentionId.toString(),
                    tweetId: tweet._id.toString(),
                    actorName: (_a = req.userName) !== null && _a !== void 0 ? _a : "someone",
                    action: "mention",
                });
            }
        }
        return res.status(201).json({
            success: true,
            message: "Tweet posted successfully",
            data: tweet,
        });
    }
    catch (error) {
        handleError(res, error, "Failed to create Tweet.");
    }
});
exports.createTweet = createTweet;
const getAllTweets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = Math.min(Number(req.query.limit) || 10, 50);
        const before = req.query.before;
        const query = {};
        // Fetch tweets older than the cursor
        if (before) {
            query._id = { $lt: before };
        }
        const tweets = yield tweet_model_1.default.find(query)
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
            .sort({ _id: -1 }) // newest first, descending order
            .limit(limit + 1); // fetch one extra to detect next page
        const hasNextPage = tweets.length > limit;
        const slicedTweets = hasNextPage ? tweets.slice(0, limit) : tweets;
        const nextCursor = hasNextPage
            ? slicedTweets[slicedTweets.length - 1]._id
            : null;
        console.log("tweets:", slicedTweets.length);
        res.status(200).json({
            message: "Tweets fetched successfully",
            data: slicedTweets,
            nextCursor,
            hasNextPage,
        });
    }
    catch (error) {
        handleError(res, error, "failed to fetch tweets");
    }
});
exports.getAllTweets = getAllTweets;
const getTweetById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tweet = yield tweet_model_1.default.findById(req.params.id)
            .populate("author", "userName")
            .populate("classroom", "title");
        //   .populate("book", "title")
        //   .populate("problemId", "title");
        if (!tweet)
            return res.status(404).json({ error: "Tweet not found" });
        res.status(200).json({ data: tweet, message: "Get single tweet" });
    }
    catch (error) {
        handleError(res, error, "Failed to fetch single tweet");
    }
});
exports.getTweetById = getTweetById;
const deleteTweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const tweet = yield tweet_model_1.default.findById(req.params.id);
        if (!tweet)
            return res.status(404).json({ error: "Tweet not found" });
        if (tweet.author.toString() !== req.userId) {
            return res
                .status(403)
                .json({ error: "Not authorized to delete this tweet" });
        }
        // Delete Cloudinary image if exists
        if ((_a = tweet === null || tweet === void 0 ? void 0 : tweet.image) === null || _a === void 0 ? void 0 : _a.public_id) {
            yield cloudinary_1.cloudinary.uploader.destroy(tweet.image.public_id);
        }
        yield tweet_model_1.default.findByIdAndDelete(req.params.id);
        res
            .status(200)
            .json({ success: true, message: "Tweet deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Error deleting tweet" });
    }
});
exports.deleteTweet = deleteTweet;
const toggleLikeTweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const tweet = yield tweet_model_1.default.findById(req.params.id);
        if (!tweet) {
            return res.status(404).json({ error: "Tweet not found" });
        }
        const userId = req.userId;
        // Convert all like IDs to string & check toggle state
        const alreadyLiked = tweet.likes.some((id) => id.toString() === userId);
        if (alreadyLiked) {
            // Remove like
            tweet.likes = tweet.likes.filter((id) => id.toString() !== userId);
        }
        else {
            // Add like
            tweet.likes.push(userId);
            // Notify tweet author (only if not self-like)
            if (tweet.author.toString() !== userId) {
                (0, queue_1.addTweetNotificationJob)({
                    actorName: (_a = req.userName) !== null && _a !== void 0 ? _a : "someone",
                    userId: tweet.author.toString(),
                    tweetId: tweet._id.toString(),
                    action: "like",
                });
            }
        }
        const updatedTweets = yield tweet.save();
        return res.status(200).json({
            success: true,
            data: updatedTweets,
            message: alreadyLiked ? "Tweet unliked" : "Tweet liked",
        });
    }
    catch (error) {
        console.error(error);
        return handleError(res, error, "Failed to like/unlike tweet");
    }
});
exports.toggleLikeTweet = toggleLikeTweet;
const repostTweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const originalTweet = yield tweet_model_1.default.findById(req.params.id);
        if (!originalTweet) {
            return res.status(404).json({ error: "Tweet not found" });
        }
        const repost = yield tweet_model_1.default.create({
            type: req.body.type || "general",
            author: req.userId,
            parentTweet: originalTweet._id,
            content: (_b = (_a = req.body.content) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : undefined,
        });
        // Notify original author (if not self)
        if (originalTweet.author.toString() !== req.userId) {
            (0, queue_1.addTweetNotificationJob)({
                actorName: (_c = req.userName) !== null && _c !== void 0 ? _c : "someone",
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
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to repost tweet" });
    }
});
exports.repostTweet = repostTweet;
