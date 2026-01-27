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
exports.createRedisWorker = createRedisWorker;
// workers/notification.worker.ts
const bullmq_1 = require("bullmq");
const classroom_model_1 = require("../models/classroom.model");
const notification_model_1 = require("../models/notification.model");
const notification_emitter_1 = require("../sockets/emitters/notification.emitter");
const ioredis_1 = __importDefault(require("ioredis"));
const connection = new ioredis_1.default({
    maxRetriesPerRequest: null,
});
function createRedisWorker() {
    const worker = new bullmq_1.Worker("notifications", (job) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        console.log("Processing job:", job.name);
        switch (job.name) {
            case "assignment-notification": {
                const { classroomId, assignmentId, classroomTitle, dueDate, title } = job.data;
                if (!classroomId || !assignmentId) {
                    throw new Error("ClassroomId / assignmentId not found");
                }
                const classroom = yield classroom_model_1.Classroom.findById(classroomId).populate("students", "_id email");
                if (!classroom ||
                    !classroom.students ||
                    classroom.students.length === 0) {
                    return;
                }
                //   1. Persist Notifications
                const notifications = classroom.students.map((student) => ({
                    user: student._id,
                    type: "assignment",
                    message: `New assignment "${title}" posted in classroom ${classroomTitle}`,
                    data: {
                        assignmentId,
                        classroomId,
                        dueDate,
                    },
                }));
                yield notification_model_1.Notification.insertMany(notifications);
                //  2. Emit Socket Events
                for (const student of classroom.students) {
                    (0, notification_emitter_1.emitAssignmentNotification)({
                        studentId: student._id.toString(),
                        assignmentId,
                        classroomId,
                        classroomTitle,
                        title,
                        dueDate,
                    });
                }
                //  3. Send Emails (optional)
                for (const student of classroom.students) {
                    // if (!student.email) continue;
                    // await sendAssignmentEmail({
                    //   toEmail: student.email,
                    //   classroomName: classroomTitle,
                    //   assignmentTitle: title,
                    //   dueDate,
                    // });
                    // console.log("Email sent to:", student.email);
                }
                break;
            }
            case "lecture-notification": {
                const { lecture } = job.data;
                if (!lecture) {
                    throw new Error("lecture missing");
                }
                const classroom = yield classroom_model_1.Classroom.findById(lecture.classroom)
                    .populate("students", "_id email")
                    .select("title students");
                if (!classroom ||
                    !classroom.students ||
                    classroom.students.length === 0) {
                    console.log("classroom not found");
                    return;
                }
                //  1. Persist Notifications
                const notificationDocs = classroom.students.map((student) => {
                    var _a, _b;
                    return ({
                        user: student._id,
                        type: "lecture",
                        message: `Lecture "${lecture.title}" is now ${lecture.status}`,
                        data: {
                            lectureId: lecture._id,
                            classroomId: lecture.classroom,
                            status: lecture.status,
                            startTime: lecture.startTime,
                            reason: lecture.status === "cancelled"
                                ? ((_a = lecture.cancelReason) !== null && _a !== void 0 ? _a : "no reason")
                                : ((_b = lecture.delayReason) !== null && _b !== void 0 ? _b : "no reason"),
                        },
                    });
                });
                if (lecture.status !== "completed")
                    yield notification_model_1.Notification.insertMany(notificationDocs);
                //  2. Emit Socket Events
                for (const student of classroom.students) {
                    (0, notification_emitter_1.emitLectureNotification)({
                        payload: lecture,
                        userId: (_a = student._id) === null || _a === void 0 ? void 0 : _a.toString(),
                    });
                }
                //  3. Send Emails (optional)
                for (const student of classroom.students) {
                    // if (!student.email) continue;
                    // await sendClassStatusEmail({
                    //   toEmail: student.email,
                    //   classroomName: classroom.title,
                    //   lectureTitle: title,
                    //   status,
                    //   startTime,
                    // });
                    // console.log("Lecture email sent to:", student.email);
                }
                break;
            }
            case "tweet-notification": {
                const { userId, tweetId, actorName, action } = job.data;
                // No self notifications
                if (userId === job.data.actorId) {
                    return;
                }
                const messageMap = {
                    mention: `${actorName} mentioned you in a tweet`,
                    like: `${actorName} liked your tweet`,
                    repost: `${actorName} reposted your tweet`,
                };
                const message = messageMap[action];
                if (!message) {
                    throw new Error(`Unknown tweet notification action: ${action}`);
                }
                // Prevent duplicates
                const exists = yield notification_model_1.Notification.exists({
                    user: userId,
                    "data.tweetId": tweetId,
                    message,
                });
                if (exists)
                    return; //? @check think should i remove it?
                // 1. Persist notification
                const notification = yield notification_model_1.Notification.create({
                    user: userId,
                    type: "message",
                    message,
                    data: { tweetId },
                });
                // 2. Best-effort realtime emit
                (0, notification_emitter_1.emitTweetNotification)({
                    userId,
                    tweetId,
                    msg: notification.message,
                });
                // 3. send mail
                //   for (const student of students) {
                //* @todo mail for twitter
                //     await sendClassStatusEmail({
                //       toEmail: student.email,
                //       classroomName: classroomId,
                //       lectureId,
                //       status,
                //       title,
                //     });
                //     console.log("Email sent to:", student.email);
                //   }
                return notification;
            }
            default:
                throw new Error("jobname mismatch");
        }
    }), {
        //   connection: {
        //     host: process.env.REDIS_HOST,
        //     port: Number(process.env.REDIS_PORT),
        //     password: process.env.REDIS_PASSWORD,
        //   },
        connection,
        concurrency: 2,
    });
    worker.on("completed", (job) => __awaiter(this, void 0, void 0, function* () {
        console.log(`Job ${job.id} completed`);
    }));
    worker.on("active", (job) => {
        var _a, _b;
        return console.log("[redis worker] active job : ", (_b = (_a = job.data.tweetId) !== null && _a !== void 0 ? _a : job.data.lectureId) !== null && _b !== void 0 ? _b : job.data.classroomId);
    });
    worker.on("failed", (job, err) => console.error(`Job ${job === null || job === void 0 ? void 0 : job.id} failed:`, err));
    worker.on("error", (err) => console.error("Worker error:", err));
}
