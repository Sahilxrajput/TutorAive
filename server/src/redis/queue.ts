import { Queue } from "bullmq";
import {
  IAssignmentNotificationJob,
  IClassNotificationJob,
  ILecture,
  ITweetNotificationJob,
  LectureStatus,
} from "../types/type";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

export const notificationQueue = new Queue("notifications", { connection });

connection
  .ping()
  .then((res) => {
    console.log("Redis says:", res); // should be PONG
    process.exit(0);
  })
  .catch((err) => {
    console.error("Redis is not reachable:", err);
    process.exit(1);
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

notificationQueue.on("waiting", (jobId) =>
  console.log(`class Job ${jobId} is waiting`),
);
