import { Queue } from "bullmq";
import {
  IAssignmentNotificationJob,
  ILecture,
  IResourceJob,
  ITweetNotificationJob,
} from "../types/type";

export const notificationQueue = new Queue("notifications", {
  connection: {
    url: process.env.REDIS_URL!,
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
    },
  );
  console.log("added in assignmnet queue : ");
};

export const addResourceJob = async ({
  classroomId,
  classroomTitle,
  title,
  resourceUrl,
}: IResourceJob) => {
  await notificationQueue.add(
    "resource-notification",
    {
      classroomId,
      classroomTitle,
      title,
      resourceUrl,
    },
    {
      attempts: 5,
      backoff: {
        type: "exponential",
        delay: 3000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    },
  );

  console.log("added in resource notification queue");
};

export const addClassNotificationJob = async (lecture: ILecture) => {
  await notificationQueue.add(
    "lecture-notification",
    { lecture },
    {
      attempts: 5,
      backoff: {
        type: "exponential",
        delay: 3000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    },
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
    },
  );

  console.log("added in tweet notification queue");
};

// notificationQueue.on("waiting", (jobId) =>
//   console.log(`class Job ${jobId} is waiting`),
// );
