import { Request, Response } from "express";
import User from "../models/user.model";
import { Classroom } from "../models/classroom.model";
import { Types } from "mongoose";
import { cloudinary } from "../lib/cloudinary";

// Create a new classroom
export const createClassroom = async (req: Request, res: Response) => {
  try {
    const { title, tags, description } = req.body;

    interface Payload {
      title: String;
      tags: string[];
      description: string;
      teacher: string;
      thumbnail?: {
        url: string;
        publicId: string;
      };
    }

    const classroomData: Payload = {
      title,
      tags,
      description,
      teacher: req.userId!,
    };

    // Validate file type
    if (
      req.file &&
      !["image/png", "image/jpeg", "image/jpg"].includes(req.file.mimetype)
    ) {
      return res.status(400).json({ error: "Invalid file type" });
    }

    // Upload file if exists
    let uploadResult: any = null;

    if (req.file) {
      uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "classroom Thumbnails" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        stream.end(req?.file?.buffer);
      });

      classroomData.thumbnail = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    const classroom = await Classroom.create(classroomData);

    res
      .status(201)
      .json({ classroom, message: "Classroom provisioned successfully!" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to launch classroom", error });
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
      .populate("teacher", "name email")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ message: "fetch classrooms successfully", data: classrooms });
  } catch (error) {
    res.status(500).json({ message: "Error fetching classrooms", error });
  }
};

// Get a single classroom by ID
export const getClassroomById = async (req: Request, res: Response) => {
  try {
    const classroom = await Classroom.findById(req.params.id)
      .populate("teacher", "name email userName profilePicture")
      .populate("students", "name email profilePicture");

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

export const enrollClassroom = async (req: Request, res: Response) => {
  try {
    const { classroomId } = req.body;
    const userId = new Types.ObjectId(req.userId);

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const isEnrolled = classroom.students.some(
      (_id: Types.ObjectId) => _id.toString() === userId!.toString(),
    );

    // Enroll user if not already enrolled
    if (!isEnrolled) {
      classroom.students.push(userId);
      user.enrolledClassrooms.push(classroom._id);
      await classroom.save();
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

export const getStudents = async (req: Request, res: Response) => {
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
