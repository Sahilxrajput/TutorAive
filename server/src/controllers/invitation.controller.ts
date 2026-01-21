import { Request, Response } from "express";
import { nanoid } from "nanoid";
import Invitation from "../models/Invitation.model";
import genearteQrCode from "../utils/generateQrCode";
import {Classroom} from "../models/classroom.model";
import Attendance from "../models/attendence.model.";

// Create new invitation
export const createInvitation = async (req: Request, res: Response) => {
  try {
    const { classroomId, expiresAt, maxUses } = req.body;

    const inviteCode = nanoid(8); // short unique code

    const invitation = await Invitation.create({
      classroom: classroomId,
      createdBy: req.userId,
      inviteCode,
      expiresAt,
      maxUses: maxUses || 0,
    });

    const qrCode = genearteQrCode(inviteCode);

    res.status(201).json({ invitation, qrCode });
  } catch (err) {
    console.error("Error creating invitation:", err);
    res.status(500).json({ message: "Error creating invitation", error: err });
  }
};

//  Get all invitations for a classroom
export const getInvitationsByClassroom = async (
  req: Request,
  res: Response
) => {
  try {
    const invitations = await Invitation.find({ classroom: req.params.id })
      .populate("createdBy", "userName email")
      .sort({ createdAt: -1 });

    res.json(invitations);
  } catch (err) {
    res.status(500).json({ message: "Error fetching invitations", error: err });
  }
};

// Get single invitation by invite code
export const getInvitationByCode = async (req: Request, res: Response) => {
  try {
    const invitation = await Invitation.findOne({
      inviteCode: req.params.code,
    });
    if (!invitation)
      return res.status(404).json({ message: "Invalid invite code" });

    if (invitation.expiresAt && invitation.expiresAt < new Date())
      return res.status(400).json({ message: "Invite expired" });

    if (
      invitation.maxUses > 0 &&
      invitation.usedBy.length >= invitation.maxUses
    )
      return res.status(400).json({ message: "Invite usage limit reached" });

    res.json(invitation);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving invitation", error: err });
  }
};

// Use an invitation to join a classroom
export const useInvitation = async (req: Request, res: Response) => {
  try {
    const invitation = await Invitation.findOne({
      inviteCode: req.params.code,
    });
    if (!invitation)
      return res.status(404).json({ message: "Invalid invite code" });

    if (invitation.expiresAt && invitation.expiresAt < new Date())
      return res.status(400).json({ message: "Invite expired" });

    if (
      invitation.maxUses > 0 &&
      invitation.usedBy.length >= invitation.maxUses
    )
      return res.status(400).json({ message: "Invite usage limit reached" });

    if (invitation.usedBy.includes(req.userId))
      return res.status(400).json({ message: "You already used this invite" });

    invitation.usedBy.push(req.userId);
    await invitation.save();

    // Auto-mark attendance
    // const today = new Date();
    // const startOfDay = new Date(today.setHours(0, 0, 0, 0));

    // await Attendance.findOneAndUpdate(
    //   { classroom: invitation. , user: req.userId, date: startOfDay },
    //   { status: "present", date: new Date() },
    //   { upsert: true, new: true }
    // );

    // Add user to classroom
    await Classroom.findByIdAndUpdate(invitation.classroom, {
      $addToSet: { students: req.userId },
    });

    res.json({
      message: "Successfully joined classroom",
      classroomId: invitation.classroom,
    });
  } catch (err) {
    res.status(500).json({ message: "Error using invitation", error: err });
  }
};

// Delete invitation
export const deleteInvitation = async (req: Request, res: Response) => {
  try {
    const invitation = await Invitation.findById(req.params.id);
    if (!invitation)
      return res.status(404).json({ message: "Invitation not found" });

    // admin also delete this code
    if (
      invitation.createdBy.toString() !== req.userId &&
      req.userRole !== "admin"
    )
      return res.status(403).json({ message: "Not authorized" });

    await invitation.deleteOne();
    res.json({ message: "Invitation deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting invitation", error: err });
  }
};
