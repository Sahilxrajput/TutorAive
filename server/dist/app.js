"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
require("./lib/passportConfig");
const db_1 = __importDefault(require("./database/db"));
const http_1 = __importDefault(require("http"));
const sockets_1 = require("./sockets");
const worker_1 = require("./redis/worker");
/* --------------- routes ------------------------ */
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const contact_routes_1 = __importDefault(require("./routes/contact.routes"));
const classroom_routes_1 = __importDefault(require("./routes/classroom.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const assignment_routes_1 = __importDefault(require("./routes/assignment.routes"));
const submission_routes_1 = __importDefault(require("./routes/submission.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const quiz_routes_1 = __importDefault(require("./routes/quiz.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const note_routes_1 = __importDefault(require("./routes/note.routes"));
const lecture_route_1 = __importDefault(require("./routes/lecture.route"));
const tweet_routes_1 = __importDefault(require("./routes/tweet.routes"));
const attendence_routes_1 = __importDefault(require("./routes/attendence.routes"));
const health_route_1 = __importDefault(require("./routes/health.route"));
const rateLimit_1 = require("./middlewares/rateLimit");
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
(0, sockets_1.initSocket)(server);
// app is running behind a proxy. Trust the headers the proxy sends.
app.set("trust proxy", 1);
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL, // your frontend URL
    credentials: true,
}));
app.use(express_1.default.json({ limit: "100kb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
(0, db_1.default)();
app.use(passport_1.default.initialize());
(0, worker_1.createRedisWorker)();
app.get("/", (_, res) => res.send("Server is  Running"));
app.use("/health", health_route_1.default);
app.use("/api/assignments", rateLimit_1.globalLimiter, assignment_routes_1.default);
app.use("/api/attendance", rateLimit_1.globalLimiter, attendence_routes_1.default);
app.use("/api/auth", rateLimit_1.authLimiter, auth_routes_1.default);
app.use("/api/contact", rateLimit_1.globalLimiter, contact_routes_1.default);
app.use("/api/classrooms", rateLimit_1.globalLimiter, classroom_routes_1.default);
app.use("/api/lectures", rateLimit_1.globalLimiter, lecture_route_1.default); // all required auth
app.use("/api/notes", rateLimit_1.globalLimiter, note_routes_1.default); // all required auth
app.use("/api/notifications", rateLimit_1.globalLimiter, notification_routes_1.default);
app.use("/api/payment", rateLimit_1.paymentLimiter, payment_routes_1.default);
app.use("/api/quizs", rateLimit_1.globalLimiter, quiz_routes_1.default);
app.use("/api/submissions", rateLimit_1.globalLimiter, submission_routes_1.default);
app.use("/api/tweets", rateLimit_1.globalLimiter, tweet_routes_1.default);
app.use("/api/users", rateLimit_1.globalLimiter, user_routes_1.default);
console.log("Server restarted at", new Date().toISOString());
server.listen(PORT, () => console.log(` Server running on port http://localhost:${PORT}`));
