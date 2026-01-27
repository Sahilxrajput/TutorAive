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
exports.deleteInvitation = exports.useInvitation = exports.getInvitationByCode = exports.getInvitationsByClassroom = exports.createInvitation = void 0;
const nanoid_1 = require("nanoid");
const Invitation_model_1 = __importDefault(require("../models/Invitation.model"));
const generateQrCode_1 = __importDefault(require("../utils/generateQrCode"));
const classroom_model_1 = require("../models/classroom.model");
// Create new invitation
const createInvitation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classroomId, expiresAt, maxUses } = req.body;
        const inviteCode = (0, nanoid_1.nanoid)(8); // short unique code
        const invitation = yield Invitation_model_1.default.create({
            classroom: classroomId,
            createdBy: req.userId,
            inviteCode,
            expiresAt,
            maxUses: maxUses || 0,
        });
        const qrCode = (0, generateQrCode_1.default)(inviteCode);
        res.status(201).json({ invitation, qrCode });
    }
    catch (err) {
        console.error("Error creating invitation:", err);
        res.status(500).json({ message: "Error creating invitation", error: err });
    }
});
exports.createInvitation = createInvitation;
//  Get all invitations for a classroom
const getInvitationsByClassroom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invitations = yield Invitation_model_1.default.find({ classroom: req.params.id })
            .populate("createdBy", "userName email")
            .sort({ createdAt: -1 });
        res.json(invitations);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching invitations", error: err });
    }
});
exports.getInvitationsByClassroom = getInvitationsByClassroom;
// Get single invitation by invite code
const getInvitationByCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invitation = yield Invitation_model_1.default.findOne({
            inviteCode: req.params.code,
        });
        if (!invitation)
            return res.status(404).json({ message: "Invalid invite code" });
        if (invitation.expiresAt && invitation.expiresAt < new Date())
            return res.status(400).json({ message: "Invite expired" });
        if (invitation.maxUses > 0 &&
            invitation.usedBy.length >= invitation.maxUses)
            return res.status(400).json({ message: "Invite usage limit reached" });
        res.json(invitation);
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Error retrieving invitation", error: err });
    }
});
exports.getInvitationByCode = getInvitationByCode;
// Use an invitation to join a classroom
const useInvitation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invitation = yield Invitation_model_1.default.findOne({
            inviteCode: req.params.code,
        });
        if (!invitation)
            return res.status(404).json({ message: "Invalid invite code" });
        if (invitation.expiresAt && invitation.expiresAt < new Date())
            return res.status(400).json({ message: "Invite expired" });
        if (invitation.maxUses > 0 &&
            invitation.usedBy.length >= invitation.maxUses)
            return res.status(400).json({ message: "Invite usage limit reached" });
        if (invitation.usedBy.includes(req.userId))
            return res.status(400).json({ message: "You already used this invite" });
        invitation.usedBy.push(req.userId);
        yield invitation.save();
        // Auto-mark attendance
        // const today = new Date();
        // const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        // await Attendance.findOneAndUpdate(
        //   { classroom: invitation. , user: req.userId, date: startOfDay },
        //   { status: "present", date: new Date() },
        //   { upsert: true, new: true }
        // );
        // Add user to classroom
        yield classroom_model_1.Classroom.findByIdAndUpdate(invitation.classroom, {
            $addToSet: { students: req.userId },
        });
        res.json({
            message: "Successfully joined classroom",
            classroomId: invitation.classroom,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Error using invitation", error: err });
    }
});
exports.useInvitation = useInvitation;
// Delete invitation
const deleteInvitation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invitation = yield Invitation_model_1.default.findById(req.params.id);
        if (!invitation)
            return res.status(404).json({ message: "Invitation not found" });
        // admin also delete this code
        if (invitation.createdBy.toString() !== req.userId &&
            req.userRole !== "admin")
            return res.status(403).json({ message: "Not authorized" });
        yield invitation.deleteOne();
        res.json({ message: "Invitation deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Error deleting invitation", error: err });
    }
});
exports.deleteInvitation = deleteInvitation;
