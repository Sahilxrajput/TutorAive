import 'dotenv/config';

import express, { Application } from "express";
import cors from "cors";
import cookieParser from 'cookie-parser'
import session from "express-session";
import passport from "passport";
import "./lib/passportConfig"; // <-- Import the passportConfig
import connectDB from "./database/db";
import authRouter from "./routes/auth/auth.routes";
import profileRouter from "./routes/profile.routes";
import http, { Server as HTTPServer } from "http";
import { initSocket } from './socket';


const PORT = process.env.PORT || 3000;

const app: Application = express();
const server: HTTPServer = http.createServer(app);
initSocket(server); // initialize socket.io

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // your frontend URL 
    credentials: true,
  })
);
app.use(cookieParser());
// Use session middleware
app.use(
  session({
    secret:process.env.SESSION_SECRET as string, // change this to a strong secret!
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 day
    },
  })
);


connectDB()
app.use(passport.initialize());
app.use(passport.session());


app.get("/", (_, res) => res.send("✅ Socket.IO Server Running"));
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);


server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));