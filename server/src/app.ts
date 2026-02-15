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
import {
  authLimiter,
  globalLimiter,
  paymentLimiter,
} from "./middlewares/rateLimit";

const PORT = process.env.PORT || 3000;

const app: Application = express();
const server: HTTPServer = http.createServer(app);

initSocket(server);

// app is running behind a proxy. Trust the headers the proxy sends.
app.set("trust proxy", 1);

const corsOptions = {
  origin: process.env.CLIENT_URL, 
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();
app.use(passport.initialize());

createRedisWorker();

app.get("/", (_, res) => res.send("Server is  Running"));
app.use("/health", healthRoute);
app.use("/api/assignments", globalLimiter, assignmentRoute);
app.use("/api/attendance", globalLimiter, attendanceRoute);
app.use("/api/auth", authLimiter, authRoute);
app.use("/api/contact", globalLimiter, contactRouter);
app.use("/api/classrooms", globalLimiter, classRoute);
app.use("/api/lectures", globalLimiter, lectureRoute); // all required auth
app.use("/api/notes", globalLimiter, notesRoute); // all required auth
app.use("/api/notifications", globalLimiter, notificationsRoute);
app.use("/api/payment", paymentLimiter, paymentRoute);
app.use("/api/quizs", globalLimiter, quizRoute);
app.use("/api/submissions", globalLimiter, submissionRoute);
app.use("/api/tweets", globalLimiter, tweetRoute);
app.use("/api/users", globalLimiter, userRoute);

console.log("Server restarted at", new Date().toISOString());

server.listen(PORT, () =>
  console.log(` Server running on port http://localhost:${PORT}`),
);
