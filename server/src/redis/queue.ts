import { Queue } from "bullmq";
import { LectureStatus } from "../types/type";

const notificationQueue = new Queue("notifications", {
  connection: {
    host: "127.0.0.1",
    // host: "localhost",
    port: 6379,
  },
});

export const addAssignmentNotificationJob = async ({
  classroomId,
  classroomTitle,
  assignmentId,
  title,
  dueDate,
}: {
  classroomId: string;
  classroomTitle: string;
  assignmentId: string;
  title: string;
  dueDate: string;
}) => {
  await notificationQueue.add(
    "assignment-notification",
    { assignmentId, classroomId, classroomTitle, title, dueDate },
    {
      attempts: 5,
      backoff: {
        type: "exponential",
        delay: 3000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    }
  );
  console.log("added in assignmnet queue : ");
};

export const addClassNotificationJob = async ({
  classroomId,
  lectureId,
  status,
  title,
}: {
  classroomId: string;
  lectureId: string;
  title: string;
  status: LectureStatus;
}) => {
  await notificationQueue.add(
    "class-notification",
    { lectureId, classroomId, title, status },
    {
      attempts: 5,
      backoff: {
        type: "exponential",
        delay: 3000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    }
  );
  console.log("added in class queue : ");
};

notificationQueue.on("waiting", (jobId) =>
  console.log(`class Job ${jobId} is waiting`)
);
