"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
require("./lib/passportConfig"); // <-- Import the passportConfig
const db_1 = __importDefault(require("./database/db"));
const auth_routes_1 = __importDefault(require("./routes/auth/auth.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const http_1 = __importDefault(require("http"));
const socket_1 = require("./socket");
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
(0, socket_1.initSocket)(server); // initialize socket.io
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL, // your frontend URL 
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
// Use session middleware
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET, // change this to a strong secret!
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production", // HTTPS only in prod
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 day
    },
}));
(0, db_1.default)();
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.get("/", (_, res) => res.send("✅ Socket.IO Server Running"));
app.use('/api/auth', auth_routes_1.default);
app.use('/api/profile', profile_routes_1.default);
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
