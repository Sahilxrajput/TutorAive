// workers/notification.worker.ts
import { Job, Worker } from "bullmq";
import Classroom from "../models/classroom.model";
import { sendAssignmentEmail, sendClassStatusEmail } from "../utils/sendEmail";

export function createRedisWorker() {
  const worker = new Worker(
    "notifications",

    async (job: Job) => {
      console.log("Processing job:", job.name);

      switch (job.name) {
        case "assignment-notification": {
          const { classroomId, assignmentId, classroomTitle, dueDate, title } = job.data;

          if (!classroomId || !assignmentId) {
            throw new Error("ClassroomId / assignmentId not found");
          }

          const { students } = await Classroom.findById(classroomId).populate(
            "students"
          );

          if (!students || students?.length == 0) {
            throw new Error("students not found");
          }

          for (const student of students) {
            // await sendAssignmentEmail({
            //   toEmail: student.email,
            //   classroomName: classroomTitle ?? "online tutor",
            //   assignmentId: assignmentId,
            // });
            // console.log("Email sent to:", student.email);
          }
          break;
        }

        case "class-notification": {
          const { classroomId, lectureId, status, title } = job.data;
          if (!classroomId || !lectureId || !status || !title) {
            throw new Error(
              "ClassroomId / lectureId / title /  status not found"
            );
          }

          const { students } = await Classroom.findById(classroomId).populate(
            "students"
          );

          if (!students || students?.length == 0) {
            throw new Error("students not found");
          }

          //   for (const student of students) {
          //     await sendClassStatusEmail({
          //       toEmail: student.email,
          //       classroomName: classroomId,
          //       lectureId,
          //       status,
          //       title,
          //     });
          //     console.log("Email sent to:", student.email);
          //   }
          break;
        }
        default:
          throw new Error("jobname mismatch");
      }
    },
    {
      connection: {
        host: "127.0.0.1",
        port: 6379,
      },
      concurrency: 2,
    }
  );

  worker.on("completed", async (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on("active", (job) =>
    console.log("[redis worker] active job : ", job.data.classroomId)
  );
  worker.on("failed", (job, err) =>
    console.error(`Job ${job?.id} failed:`, err)
  );
  worker.on("error", (err) => console.error("Worker error:", err));
}
