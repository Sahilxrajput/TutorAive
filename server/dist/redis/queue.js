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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTweetNotificationJob = exports.addClassNotificationJob = exports.addResourceJob = exports.addAssignmentNotificationJob = exports.notificationQueue = void 0;
const bullmq_1 = require("bullmq");
exports.notificationQueue = new bullmq_1.Queue("notifications", {
    connection: {
        url: process.env.REDIS_URL,
    },
});
const addAssignmentNotificationJob = (_a) => __awaiter(void 0, [_a], void 0, function* ({ classroomId, classroomTitle, assignmentId, title, dueDate, }) {
    yield exports.notificationQueue.add("assignment-notification", { assignmentId, classroomId, classroomTitle, title, dueDate }, {
        attempts: 5,
        backoff: {
            type: "exponential",
            delay: 3000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    });
    console.log("added in assignmnet queue : ");
});
exports.addAssignmentNotificationJob = addAssignmentNotificationJob;
const addResourceJob = (_a) => __awaiter(void 0, [_a], void 0, function* ({ classroomId, classroomTitle, title, resourceUrl, }) {
    yield exports.notificationQueue.add("resource-notification", {
        classroomId,
        classroomTitle,
        title,
        resourceUrl,
    }, {
        attempts: 5,
        backoff: {
            type: "exponential",
            delay: 3000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    });
    console.log("added in resource notification queue");
});
exports.addResourceJob = addResourceJob;
const addClassNotificationJob = (lecture) => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.notificationQueue.add("lecture-notification", { lecture }, {
        attempts: 5,
        backoff: {
            type: "exponential",
            delay: 3000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    });
    console.log("added in class queue : ");
});
exports.addClassNotificationJob = addClassNotificationJob;
const addTweetNotificationJob = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, tweetId, actorName, action, }) {
    yield exports.notificationQueue.add("tweet-notification", {
        userId,
        tweetId,
        actorName,
        action,
    }, {
        attempts: 5,
        backoff: {
            type: "exponential",
            delay: 3000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    });
    console.log("added in tweet notification queue");
});
exports.addTweetNotificationJob = addTweetNotificationJob;
// notificationQueue.on("waiting", (jobId) =>
//   console.log(`class Job ${jobId} is waiting`),
// );
