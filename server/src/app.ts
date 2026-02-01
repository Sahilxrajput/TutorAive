import "dotenv/config";

import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./lib/passportConfig"; 
import connectDB from "./database/db";
import http, { Server as HTTPServer } from "http";
import { initSocket } from "./sockets";
import { createRedisWorker } from "./redis/worker";

/* --------------- routes ------------------------ */
import authRoute from "./routes/auth.routes";
import contactRouter from "./routes/contact.routes";
import classRoute from "./routes/classroom.routes";
import userRoute from "./routes/user.routes";
import invitationRoute from "./routes/invitation.routes";
import assignmentRoute from "./routes/assignment.routes";
import submissionRoute from "./routes/submission.routes";
import paymentRoute from "./routes/payment.routes";
import quizRoute from "./routes/quiz.routes";
import notificationsRoute from "./routes/notification.routes";
import notesRoute from "./routes/note.routes";
import lectureRoute from "./routes/lecture.route";
import tweetRoute from "./routes/tweet.routes";
import attendanceRoute from "./routes/attendence.routes";
import healthRoute from "./routes/health.route";

const PORT = process.env.PORT || 3000;

const app: Application = express();
const server: HTTPServer = http.createServer(app);

initSocket(server);

app.use(
  cors({
    origin: process.env.CLIENT_URL, // your frontend URL
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();
app.use(passport.initialize());

createRedisWorker();

app.get("/", (_, res) => res.send("Server is  Running"));
app.use("/health", healthRoute);
app.use("/api/assignments", assignmentRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/auth", authRoute);
app.use("/api/contact", contactRouter);
app.use("/api/classrooms", classRoute);
app.use("/api/invitations", invitationRoute);
app.use("/api/lectures", lectureRoute); // all required auth
app.use("/api/notes", notesRoute); // all required auth
app.use("/api/notifications", notificationsRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/quizs", quizRoute);
app.use("/api/submissions", submissionRoute);
app.use("/api/tweets", tweetRoute);
app.use("/api/users", userRoute);


console.log("Server restarted at", new Date().toISOString());

server.listen(PORT, () =>
  console.log(` Server running on port http://localhost:${PORT}`),
);
