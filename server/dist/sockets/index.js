"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = exports.io = void 0;
const socket_io_1 = require("socket.io");
const socketAuth_1 = require("../middlewares/socketAuth");
const attendence_model_1 = __importDefault(require("../models/attendence.model."));
const webrtcTransport_handler_1 = require("./handlers/webrtcTransport.handler");
const transportConnect_handler_1 = require("./handlers/transportConnect.handler");
const transportProduce_handler_1 = require("./handlers/transportProduce.handler");
const consume_handler_1 = require("./handlers/consume.handler");
const getProducers_handler_1 = require("./handlers/getProducers.handler");
const consumerResume_handler_1 = require("./handlers/consumerResume.handler");
const leaveStudentLiveSession_1 = require("./handlers/leaveStudentLiveSession");
const qna_socket_1 = require("./qna.socket");
const chat_socket_1 = require("./chat.socket");
const poll_socket_1 = require("./poll.socket");
const system_socket_1 = require("./system.socket");
const leaveInstructorLiveSession_1 = require("./handlers/leaveInstructorLiveSession");
const joinLiveSession_student_handler_1 = require("./handlers/joinLiveSession.student.handler");
const joinLiveSession_instructor_handler_1 = require("./handlers/joinLiveSession.instructor.handler");
exports.io = null;
const initSocket = (httpServer) => __awaiter(void 0, void 0, void 0, function* () {
    exports.io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
        },
    });
    const classroom = exports.io.of("/classroom");
    classroom.use(socketAuth_1.socketAuthMiddleware);
    classroom.on("connection", (socket) => {
        console.log("Somthing connected!", socket.id);
        const userId = socket.data.userId;
        const isInstructor = socket.data.userRole === "instructor";
        if (!userId) {
            console.error("Socket connected WITHOUT userId");
            socket.disconnect(true);
            return;
        }
        socket.join(`user:${userId}`);
        // console.log(`User ${userId} joined user:${userId}`);
        socket.on("join:live-session", isInstructor
            ? (0, joinLiveSession_instructor_handler_1.handleInstructorJoinLiveSession)(socket)
            : (0, joinLiveSession_student_handler_1.handleStudentJoinLiveSession)(socket));
        socket.on("createWebRtcTransport", (0, webrtcTransport_handler_1.handleCreateWebRtcTransport)(socket));
        socket.on("transport-connect", (0, transportConnect_handler_1.handleTransportConnect)());
        socket.on("transport-produce", (0, transportProduce_handler_1.handleTransportProduce)(socket));
        socket.on("consume", (0, consume_handler_1.handleConsume)(socket));
        socket.on("consumer-resume", (0, consumerResume_handler_1.handleConsumerResume)(socket));
        socket.on("get-producres", (0, getProducers_handler_1.handleGetProducers)());
        socket.on("leave:live-session", isInstructor
            ? (0, leaveInstructorLiveSession_1.leaveInstructorLiveSession)(socket)
            : (0, leaveStudentLiveSession_1.leaveStudentLiveSession)(socket));
        // socket.on("lecture:join", ({ lectureId, user }) => {
        //   socket.join(lectureId);
        //   emitSystemMessage(
        //     io,
        //     lectureId,
        //     `${user.userName} joined the live class`
        //   );
        // });
        // registered Sockets
        (0, qna_socket_1.registerQnaSocket)(socket);
        (0, chat_socket_1.registerChatSocket)(socket);
        (0, poll_socket_1.registerPollSocket)(socket);
        (0, system_socket_1.registerSystemSocket)(socket);
        socket.on("join:classroom", (classroomId) => {
            socket.join(classroomId);
        });
        socket.on("join-lecture", (_a) => __awaiter(void 0, [_a], void 0, function* ({ lectureId, classroomId }) {
            yield attendence_model_1.default.findOneAndUpdate({ lectureId, classroom: classroomId, student: userId }, {
                status: "present",
                joinTime: new Date(),
            });
        }));
        socket.on("leave-lecture", (_a) => __awaiter(void 0, [_a], void 0, function* ({ lectureId, classroomId }) {
            yield attendence_model_1.default.findOneAndUpdate({ lectureId, classroom: classroomId, student: userId }, {
                leaveTime: new Date(),
            });
        }));
        socket.on("disconnect", isInstructor
            ? (0, leaveInstructorLiveSession_1.leaveInstructorLiveSession)(socket)
            : (0, leaveStudentLiveSession_1.leaveStudentLiveSession)(socket));
    });
});
exports.initSocket = initSocket;
const getIO = () => {
    if (!exports.io) {
        throw new Error("Socket.io not initialized");
    }
    return exports.io.of("/classroom");
};
exports.getIO = getIO;
