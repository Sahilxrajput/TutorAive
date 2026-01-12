import { Queue } from "bullmq";
import IORedis from "ioredis";
import {
  IAssignmentNotificationJob,
  IClassNotificationJob,
  ITweetNotificationJob,
  LectureStatus,
} from "../types/type";

export const notificationQueue = new Queue("notifications", {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  },
});

export const addAssignmentNotificationJob = async ({
  classroomId,
  classroomTitle,
  assignmentId,
  title,
  dueDate,
}: IAssignmentNotificationJob) => {
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
  startTime,
  reason,
  lectureId,
  status,
  title,
}: IClassNotificationJob) => {
  await notificationQueue.add(
    "class-notification",
    { lectureId, startTime, reason, classroomId, title, status },
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

export const addTweetNotificationJob = async ({
  userId,
  tweetId,
  actorName,
  action,
}: ITweetNotificationJob) => {
  await notificationQueue.add(
    "tweet-notification",
    {
      userId,
      tweetId,
      actorName,
      action,
    },
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

  console.log("added in tweet notification queue");
};

notificationQueue.on("waiting", (jobId) =>
  console.log(`class Job ${jobId} is waiting`)
);
