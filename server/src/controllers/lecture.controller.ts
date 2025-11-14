import { Request, Response } from "express";
import User from "../models/user.model";
import Classroom from "../models/classroom.model";
import Lecture from "../models/lecture.model";

const handleError = (
  res: Response,
  error: any,
  defaultMessage: string = "Internal Server Error",
  statusCode: number = 500
) => {
  console.error(error); // Log the detailed error for debugging
  return res.status(statusCode).json({
    success: false,
    error: error?.message || defaultMessage,
    message: defaultMessage,
  });
};

// --- Helper function for Authorization checks ---
const checkAuthorization = async (
  req: Request,
  res: Response,
  lectureId: string
) => {
  const lecture = await Lecture.findById(lectureId);

  if (!lecture) {
    return res
      .status(404)
      .json({ success: false, message: "Lecture not found" });
  }

  // Convert to string for consistent comparison
  if (req.userId?.toString() !== lecture.createdBy.toString()) {
    return res.status(403).json({
      success: false,
      message:
        "Authorization failed: Only the lecture creator can perform this action.",
    });
  }
  return lecture;
};

export const createLecture = async (req: Request, res: Response) => {
  try {
    const { title, status, startTime, classroomId } = req.body;

    // 1. Validate mandatory fields
    if (!title || !classroomId || !startTime) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, classroomId, startTime.",
      });
    }

    // 2. Fetch User and Classroom concurrently
    const classroom = await Classroom.findById(classroomId);

    if (!classroom)
      return res
        .status(404)
        .json({ success: false, message: "Classroom not found." });

    // 3. Authorization Check: Only classroom instructor can create a lecture
    if (classroom.createdBy.toString() !== req.userId?.toString()) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: Only the instructor of the classroom can create lectures.",
      });
    }

    // 4. Create the Lecture
    const newLecture = await Lecture.create({
      title,
      status: status || "completed", //?@fix Default status if not provided
      createdBy: req.userId,
      startTime,
      classroom: classroom._id,
    });

    const msg =
      newLecture.status === "scheduled"
        ? "Class successfully scheduled."
        : "Class successfully completed.";
    return res
      .status(201)
      .json({ success: true, message: msg, data: newLecture });
  } catch (error) {
    handleError(res, error, "Failed to create lecture.");
  }
};

export const updateLecture = async (req: Request, res: Response) => {
  try {
    const lectureId = req.params.id;
    const { title, status, startTime } = req.body;

    // Must update at least one field
    if (!title && !startTime && !status) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields. Update at least one field.",
      });
    }

    // ✔ Check if lecture exists and user is authorized
    const lecture = await checkAuthorization(req, res, lectureId);
    if (!lecture) return; // checkAuthorization already sent a response

    // Build update object without undefined values
    const updateFields: any = {};
    if (title !== undefined) updateFields.title = title;
    if (startTime !== undefined) updateFields.startTime = startTime;
    if (status !== undefined) updateFields.status = status;

    // Update the lecture
    const updatedLecture = await Lecture.findByIdAndUpdate(
      lectureId,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedLecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found for update.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lecture updated successfully.",
      data: updatedLecture,
    });
  } catch (error) {
    handleError(res, error, "Failed to update lecture.");
  }
};
33
export const deleteLecture = async (req: Request, res: Response) => {
  try {
    const lectureId = req.params.id;

    // Use the helper to check existence and authorization
    const lecture = await checkAuthorization(req, res, lectureId);
    if (!lecture) return; // Response handled by checkAuthorization

    await Lecture.findByIdAndDelete(lectureId);

    return res.status(200).json({
      success: true,
      message: "Lecture deleted successfully.",
    });
  } catch (error) {
    handleError(res, error, "Failed to delete lecture.");
  }
};

export const getAllScheduleLecturesForInstructor = async (
  req: Request,
  res: Response
) => {
  try {
    // Find by createdBy AND status in a single query (more efficient)
    const scheduledLectures = await Lecture.find({
      createdBy: req.userId,
      status: "scheduled",
    }).sort({ startTime: 1 });

    return res.status(200).json({
      success: true,
      message: "Successfully fetched scheduled lectures created by instructor.",
      data: scheduledLectures,
    });
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to fetch scheduled lectures for instructor."
    );
  }
};

export const getAllLecturesForInstructor = async (
  req: Request,
  res: Response
) => {
  try {
    const lectures = await Lecture.find({ createdBy: req.userId }).sort({
      startTime: 1,
    }); // Sort by time

    // Return empty array with 200 status if none found (better than 404 for a list route)
    return res.status(200).json({
      success: true,
      message: "Successfully fetched all created lectures.",
      data: lectures,
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch created lectures.");
  }
};

export const getAllClassroomLecturesForInstructor = async (
  req: Request,
  res: Response
) => {
  try {
    const lectures = await Lecture.find({
      createdBy: req.userId, // ? @ok think about it
      classroom: req.params.classroomId,
    }).sort({ startTime: 1 });

    return res.status(200).json({
      success: true,
      message: `Successfully fetched lectures for classroom ${req.params.classroomId}.`,
      data: lectures,
    });
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to fetch classroom lectures for instructor."
    );
  }
};

export const getAllScheduleLecturesForStudent = async (
  req: Request,
  res: Response
) => {
  try {
    const scheduledLectures = await Lecture.find({ status: "scheduled" })
      .populate({
        path: "classroom",
        match: { students: req.userId },
        select: "title students",
      })
      .sort({ startTime: 1 })
      .exec()
      .then((lectures) => lectures.filter((l) => l.classroom));

    return res.status(200).json({
      success: true,
      message: "Successfully fetched scheduled lectures for student.",
      data: scheduledLectures,
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch scheduled lectures for student.");
  }
};

export const getAllLecturesForStudent = async (req: Request, res: Response) => {
  try {
    const myLectures = await Lecture.find({})
      .populate({
        path: "classroom",
        match: { students: req.userId },
        select: "title students", // Only fetch necessary fields from classroom
      })
      .sort({ startTime: 1 })
      .exec()
      .then((lectures) => lectures.filter((l) => l.classroom));

    return res.status(200).json({
      success: true,
      message: "Successfully fetched enrolled lectures.",
      data: myLectures,
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch enrolled lectures.");
  }
};

export const getAllClassroomLecturesForStudent = async (
  req: Request,
  res: Response
) => {
  try {
    // Similar optimization as /my, but filtered by classroomId
    const myLectures = await Lecture.find({
      classroom: req.params.classroomId,
    })
      .populate({
        path: "classroom",
        match: { students: req.userId },
        select: "title students",
      })
      .sort({ startTime: 1 })
      .exec()
      .then((lectures) => lectures.filter((l) => l.classroom));

    return res.status(200).json({
      success: true,
      message: `Successfully fetched your lectures for classroom ${req.params.classroomId}.`,
      data: myLectures,
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch classroom lectures for student.");
  }
};

export const getAllScheduleLecturesForClassroom = async (
  req: Request,
  res: Response
) => {
  try {
    const classroomId = req.params.classroomId;

    // 1. Validate Classroom
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res
        .status(404)
        .json({ success: false, message: "Classroom not found." });
    }

    // 2. Authorization Check
    const userIdString = req.userId?.toString();
    const isInstructor = classroom.createdBy.toString() === userIdString;
    const isStudent = classroom.students.some(
      (studentId: any) => studentId.toString() === userIdString
    );

    if (!isInstructor && !isStudent) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You are neither the instructor nor an enrolled student in this classroom.",
      });
    }

    // 3. Fetch scheduled lectures
    const scheduledLectures = await Lecture.find({
      classroom: classroomId,
      status: "scheduled",
    }).sort({ startTime: 1 });

    return res.status(200).json({
      success: true,
      message: "Successfully fetched scheduled lectures for classroom.",
      data: scheduledLectures,
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch scheduled classroom lectures.");
  }
};
