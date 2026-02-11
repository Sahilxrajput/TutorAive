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
exports.addTweetNotificationJob = exports.addClassNotificationJob = exports.addAssignmentNotificationJob = exports.notificationQueue = void 0;
const bullmq_1 = require("bullmq");
exports.notificationQueue = new bullmq_1.Queue("notifications", {
    connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
    },
});
// connection
//   .ping()
//   .then((res) => {
//     console.log("Redis says:", res); // should be PONG
//     process.exit(0);
//   })
//   .catch((err) => {
//     console.error("Redis is not reachable:", err);
//     process.exit(1);
//   });
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
// export const addClassNotificationJob = async ({
//   classroomId,
//   startTime,
//   reason,
//   lectureId,
//   status,
//   title,
// }: IClassNotificationJob) => {
//   await notificationQueue.add(
//     "class-notification",
//     { lectureId, startTime, reason, classroomId, title, status },
//     {
//       attempts: 5,
//       backoff: {
//         type: "exponential",
//         delay: 3000,
//       },
//       removeOnComplete: true,
//       removeOnFail: false,
//     }
//   );
//   console.log("added in class queue : ");
// };
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
exports.notificationQueue.on("waiting", (jobId) => console.log(`class Job ${jobId} is waiting`));
