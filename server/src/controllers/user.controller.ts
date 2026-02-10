import { Types } from "mongoose";
import { Classroom } from "../models/classroom.model";
import User from "../models/user.model";
import { Request, Response } from "express";

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

export async function getUserClassrooms(req: Request, res: Response) {
  try {
    const userId = new Types.ObjectId(req.userId);

    const classrooms = await Classroom.find({
      $or: [{ teacher: userId }, { students: userId }],
    });

    res.status(200).json(classrooms);
  } catch (error) {
    console.error("Error fetching enrolled classrooms:", error);
    res.status(500).json({ message: "Server error" });
  }
}

