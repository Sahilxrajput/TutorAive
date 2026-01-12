import "dotenv/config";

import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./lib/passportConfig"; // <-- Import the passportConfig
import connectDB from "./database/db";
import http, { Server as HTTPServer } from "http";

/* --------------- routes ------------------------ */
import authRouter from "./routes/auth.routes";
import classRouter from "./routes/classroom.routes";
import profileRouter from "./routes/user.routes";
import invitationRouter from "./routes/invitation.routes";
import assignmentRoutes from "./routes/assignment.routes";
import submissionRoutes from "./routes/submission.routes";
import paymentRoutes from "./routes/payment.routes";
import quizRouter from "./routes/quiz.routes";
import notificationsRouter from "./routes/notification.routes";
import genearteQrCode from "./utils/generateQrCode";
import notesRouter from "./routes/note.routes";
import lectureRouter from "./routes/lecture.route";
import tweetRouter from "./routes/tweet.routes";
import { initSocket } from "./sockets";
import { createRedisWorker } from "./redis/worker";
import attendanceRoutes from "./routes/attendence.routes";

const PORT = process.env.PORT || 3000;

const app: Application = express();
const server: HTTPServer = http.createServer(app);

initSocket(server);

app.use(
  cors({
    origin: process.env.CLIENT_URL, // your frontend URL
    // origin:"*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



connectDB();
app.use(passport.initialize());

createRedisWorker();

app.get("/", (_, res) => res.send("Socket.IO Server Running"));
app.use("/api/assignments", assignmentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/auth", authRouter);
app.use("/api/classrooms", classRouter);
app.use("/api/invitations", invitationRouter);
app.use("/api/lectures", lectureRouter); // all required auth
app.use("/api/notes", notesRouter); // all required auth
app.use("/api/notifications", notificationsRouter);
app.use("/api/payment", paymentRoutes);
app.use("/api/quizs", quizRouter);
app.use("/api/submissions", submissionRoutes);
app.use("/api/tweets", tweetRouter);
app.use("/api/users", profileRouter);

app.get("/join", async (req, res) => {
  try {
    const r = await genearteQrCode("1234");
    console.log(r);
    res.json(r);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

console.log("Server restarted at", new Date().toISOString());


server.listen(PORT, () =>
  console.log(` Server running on port http://localhost:${PORT}`)
);
