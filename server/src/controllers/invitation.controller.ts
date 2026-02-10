import { Request, Response } from "express";
import { nanoid } from "nanoid";
import Invitation from "../models/Invitation.model";
import genearteQrCode from "../utils/generateQrCode";
import { Classroom } from "../models/classroom.model";
import User from "../models/user.model";
import { sendClassInviteEmail } from "../utils/sendEmail";
import { error } from "console";

// Create new invitation
export const createInvitation = async (req: Request, res: Response) => {
  try {
    const { classroomId } = req.params;

    const inviteCode = nanoid(8); // short unique code

    await Invitation.create({
      classroom: classroomId,
      createdBy: req.userId,
      inviteCode,
      maxUses: req.body?.maxUses ?? 0,
    });

    const invitationLink = `${process.env.CLIENT_URL}/classrooms/${classroomId}/join/${inviteCode}`;

    const qrCode = await genearteQrCode(inviteCode);
    console.log(qrCode);
    res.status(201).json({ invitationLink, qrCode });
  } catch (err) {
    console.error("Error creating invitation:", err);
    res.status(500).json({ message: "Error creating invitation", error: err });
  }
};

//  Get all invitations for a classroom
export const getInvitationsByClassroom = async (
  req: Request,
  res: Response,
) => {
  try {
    const invitations = await Invitation.find({
      classroom: req.params.classroomId,
    })
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
    const invitation = await Invitation.findOneAndUpdate(
      {
        inviteCode: req.params.code,
        expiresAt: { $gt: new Date() },
        usedBy: { $ne: req.userId },
        $expr: { $lt: [{ $size: "$usedBy" }, "$maxUses"] },
      },
      {
        $addToSet: { usedBy: req.userId },
      },
      { new: true },
    );

    if (!invitation) {
      return res.status(400).json({ message: "Invalid or expired invite" });
    }


    await Classroom.findByIdAndUpdate(invitation.classroom, {
      $addToSet: { students: req.userId },
    });

    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { enrolledClassrooms: invitation.classroom },
    });

    res.json({
      message: "Successfully joined classroom",
      classroomId: invitation.classroom,
    });
  } catch (err) {
    console.log(err)
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

//send class invite
export const sendInvitationMail = async (req: Request, res: Response) => {
  try {
    const { email, invitationLink } = req.body;

    const classroom = req.authorizedResource;

    if (!classroom)
      return res.status(404).json({ message: "classroom is not found" });

    const { teacher } = await classroom.populate("teacher", "userName");

    await sendClassInviteEmail({
      studentEmail: email,
      teacherName: teacher?.userName,
      classroomName: classroom.title,
      invitationLink,
    });
    console.log("mail success");
    res.json({ message: "Invitation sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send invite", error });
  }
};
