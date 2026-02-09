import { Request, Response } from "express";
import User from "../models/user.model";
import { Classroom } from "../models/classroom.model";
import { Types } from "mongoose";

// Create a new classroom
export const createClassroom = async (req: Request, res: Response) => {
  try {
    const classroom = await Classroom.create({
      ...req.body,
      teacher: req.userId,
    });
    res.status(201).json(classroom);
  } catch (error) {
    res.status(400).json({ message: "Failed to create classroom", error });
  }
};

// @todo
// Get all classrooms (with optional filtering)
export const getClassrooms = async (req: Request, res: Response) => {
  try {
    const { status, isPublic } = req.query;
    const filter: Record<string, any> = {};
    if (status) filter.status = status;
    if (isPublic !== undefined) filter.isPublic = isPublic === "true";

    const classrooms = await Classroom.find(filter)
      //? @fix think about populated fields
      .populate("teacher", "name email")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ message: "fetch classrooms successfully", data: classrooms });
  } catch (error) {
    res.status(500).json({ message: "Error fetching classrooms", error });
  }
};

// get all enrolled classrooms
// export const getAllEnrolledClassrooms = async (req: Request, res: Response) => {
//   const classrooms = await Classroom.find({
//     students: req.userId,
//   });

//   if (!classrooms)
//     return res.status(404).json({
//       message: "classrooms not found",
//     });

//   console.log("classrooms -> ", classrooms);
//   return res.status(200).json({
//     message: "fetch all enrolled classrooms",
//     data: classrooms,
//   });
// };

// Get a single classroom by ID
export const getClassroomById = async (req: Request, res: Response) => {
  try {
    const classroom = await Classroom.findById(req.params.id)
      .populate("teacher", "name email profilePicture")
      .populate("students", "name email profilePicture");

    //@remind
    if (!classroom)
      return res.status(404).json({ message: "Classroom not found" });

    res.json(classroom);
  } catch (error) {
    res.status(500).json({ message: "Error fetching classroom", error });
  }
};

// Update classroom details
export const updateClassroom = async (req: Request, res: Response) => {
  try {
    const updated = await Classroom.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Classroom not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Failed to update classroom", error });
  }
};

//@todo permanent delete
// Delete (soft-delete or permanently remove)
export const deleteClassroom = async (req: Request, res: Response) => {
  try {
    const classroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      { status: "deleted" },
      { new: true },
    );
    if (!classroom)
      return res.status(404).json({ message: "Classroom not found" });
    res.json({ message: "Classroom deleted", classroom });
  } catch (error) {
    res.status(500).json({ message: "Error deleting classroom", error });
  }
};

// Join a classroom using joinCode
export const enrollClassroomByCode = async (req: Request, res: Response) => {
  try {
    const { joinCode } = req.body;
    const classroom = await Classroom.findOne({ joinCode });
    if (!classroom)
      return res.status(404).json({ message: "Invalid join code" });
    const userID = new Types.ObjectId(req.userId);
    if (!classroom.students.includes(userID)) {
      classroom.students.push(userID);
      await classroom.save();
    }
    res.json({ message: "Joined classroom successfully", classroom });
  } catch (error) {
    res.status(500).json({ message: "Error joining classroom", error });
  }
};

export const enrollClassroom = async (req: Request, res: Response) => {
  try {
    const { classroomId } = req.body;
    const userId = new Types.ObjectId(req.userId); // ensure this is populated by auth middleware

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Enroll user if not already enrolled
    if (!classroom.students.includes(userId)) {
      console.log("classroom update");
      classroom.students.push(userId);
      await classroom.save();
    }

    // Update user's enrolledCourses
    if (!user.enrolledClassrooms.includes(classroomId)) {
      console.log("user update");
      user.enrolledClassrooms.push(classroomId);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Enrolled in classroom successfully",
      classroom,
    });
  } catch (error) {
    console.error("Error enrolling classroom:", error);
    res.status(500).json({
      success: false,
      message: "Error enrolling in classroom",
      error: (error as Error).message,
    });
  }
};

// Archive a classroom
export const archiveClassroom = async (req: Request, res: Response) => {
  try {
    const classroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      { status: "archived" },
      { new: true },
    );
    if (!classroom)
      return res.status(404).json({ message: "Classroom not found" });
    res.json({ message: "Classroom archived", classroom });
  } catch (error) {
    res.status(500).json({ message: "Error archiving classroom", error });
  }
};

export const getStudents = async (req:Request, res:Response) => {
  try {

    // pagination values
    const page = Number(req.query.page) || 1;
    const limit = 1;
    const skip = (page - 1) * limit;

    const classroom = req.authorizedResource;

    const totalStudents = classroom.students.length;

    // populate only required students
    await classroom.populate({
      path: "students",
      options: { skip, limit },
    });

    res.json({
      totalStudents,
      page,
      limit,
      students: classroom.students,
      teacher: classroom.teacher,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }

};
