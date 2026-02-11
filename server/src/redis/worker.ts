// workers/notification.worker.ts
import { Job, Worker } from "bullmq";
import { Classroom } from "../models/classroom.model";
import { sendAssignmentEmail, sendClassStatusEmail } from "../utils/sendEmail";
import { Notification } from "../models/notification.model";
import {
  emitAssignmentNotification,
  emitLectureNotification,
  emitTweetNotification,
} from "../sockets/emitters/notification.emitter";
import { ILecture } from "../types/type";


export function createRedisWorker() {
  const worker = new Worker(
    "notifications",

    async (job: Job) => {
      console.log("Processing job:", job.name);

      switch (job.name) {
        case "assignment-notification": {
          const { classroomId, assignmentId, classroomTitle, dueDate, title } =
            job.data;

          if (!classroomId || !assignmentId) {
            throw new Error("ClassroomId / assignmentId not found");
          }

          const classroom = await Classroom.findById(classroomId).populate(
            "students",
            "_id email",
          );

          if (
            !classroom ||
            !classroom.students ||
            classroom.students.length === 0
          ) {
            return;
          }

          //   1. Persist Notifications
          const notifications = classroom.students.map((student: any) => ({
            user: student._id,
            type: "assignment",
            message: `New assignment "${title}" posted in classroom ${classroomTitle}`,
            data: {
              assignmentId,
              classroomId,
              dueDate,
            },
          }));

          await Notification.insertMany(notifications);

          //  2. Emit Socket Events
          for (const student of classroom.students) {
            emitAssignmentNotification({
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
          const { lecture }: { lecture: ILecture } = job.data;
          if (!lecture) {
            throw new Error("lecture missing");
          }

          const classroom = await Classroom.findById(lecture.classroom)
            .populate("students", "_id email")
            .select("title students");

          if (
            !classroom ||
            !classroom.students ||
            classroom.students.length === 0
          ) {
            console.log("classroom not found");
            return;
          }

          //  1. Persist Notifications
          const notificationDocs = classroom.students.map((student: any) => ({
            user: student._id,
            type: "lecture",
            message: `Lecture "${lecture.title}" is now ${lecture.status}`,
            data: {
              lectureId: lecture._id,
              classroomId: lecture.classroom,
              status: lecture.status,
              startTime: lecture.startTime,
              reason:
                lecture.status === "cancelled"
                  ? (lecture.cancelReason ?? "no reason")
                  : (lecture.delayReason ?? "no reason"),
            },
          }));
          if (lecture.status !== "completed")
            await Notification.insertMany(notificationDocs);

          //  2. Emit Socket Events
          for (const student of classroom.students) {
            emitLectureNotification({
              payload: lecture,
              userId: student._id?.toString(),
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
          const messageMap: Record<string, string> = {
            mention: `${actorName} mentioned you in a tweet`,
            like: `${actorName} liked your tweet`,
            repost: `${actorName} reposted your tweet`,
          };

          const message = messageMap[action];
          if (!message) {
            throw new Error(`Unknown tweet notification action: ${action}`);
          }

          // Prevent duplicates
          const exists = await Notification.exists({
            user: userId,
            "data.tweetId": tweetId,
            message,
          });

          if (exists) return; //? @check think should i remove it?

          // 1. Persist notification
          const notification = await Notification.create({
            user: userId,
            type: "message",
            message,
            data: { tweetId },
          });

          // 2. Best-effort realtime emit
          emitTweetNotification({
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
    },
    {
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
      concurrency: 2,
    },
  );

  worker.on("completed", async (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on("active", (job) =>
    console.log(
      "[redis worker] active job : ",
      job.data.tweetId ?? job.data.lectureId ?? job.data.classroomId,
    ),
  );
  worker.on("failed", (job, err) =>
    console.error(`Job ${job?.id} failed:`, err),
  );
  worker.on("error", (err) => console.error("Worker error:", err));
}
