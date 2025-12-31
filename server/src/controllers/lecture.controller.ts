import { Request, Response } from "express";
import User from "../models/user.model";
import Classroom from "../models/classroom.model";
import Lecture from "../models/lecture.model";
import { classroomSocket } from "../sockets/socketRef";
import { addClassNotificationJob } from "../redis/queue";
import { ClassUpdatePayload, IClassroom, LectureStatus } from "../types/type";
import { emitClassUpdate } from "../sockets/class/class.emitter";

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

const ALLOWED_TRANSITIONS: Record<LectureStatus, LectureStatus[]> = {
  scheduled: ["rescheduled", "live", "delayed", "cancelled"],
  rescheduled: ["rescheduled", "live", "delayed", "cancelled"],
  //   starting_soon: ["live", "delayed", "cancelled"],
  delayed: ["scheduled", "live", "cancelled"],
  live: ["completed"],
  completed: [],
  cancelled: [],
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

    if (!title || !classroomId || !startTime || !status) {
      console.log(
        "Missing required fields: title, classroomId, startTime, status."
      );
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: title, classroomId, startTime, status.",
      });
    }

    const classroom = await Classroom.findById(classroomId);

    if (!classroom) {
      return res
        .status(404)
        .json({ success: false, message: "Classroom not found." });
    }

    if (classroom.createdBy.toString() !== req.userId?.toString()) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: Only the instructor of the classroom can create lectures.",
      });
    }

    const newLecture = await Lecture.create({
      title,
      status,
      createdBy: req.userId,
      startTime,
      classroom: classroom._id,
    });

    /* ---------------- NOTIFICATION + EMAIL ---------------- */

    const payload: ClassUpdatePayload = {
      lectureId: newLecture._id.toString(),
      classroomId: classroom._id.toString(),
      classroomName: classroom.title,
      title: newLecture.title,
      status: newLecture.status,
      startTime: newLecture.startTime.toISOString(),
    };

    // socket emittor
    emitClassUpdate(payload);

    // email pub/subs
    // await addClassNotificationJob({
    //   classroomId: classroom._id.toString(),
    //   lectureId: newLecture._id.toString(),
    //   title,
    //   status,
    // });

    let msg = "Lecture created successfully.";
    if (status === "scheduled") msg = `lecture ${newLecture.title} successfully scheduled.`;
    if (status === "live") msg = `lecture ${newLecture.title} is live now.`;

    return res.status(201).json({
      success: true,
      message: msg,
      data: newLecture,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateLecture = async (req: Request, res: Response) => {
  try {
    const { status, title, newStartTime, reason } = req.body;

    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    let shouldNotify = false;

    /* ---------------- TITLE UPDATE ---------------- */
    if (title && title !== lecture.title) {
      lecture.title = title;
    }

    /* ---------------- STATUS UPDATE ---------------- */
    if (status) {
      const allowedNext = ALLOWED_TRANSITIONS[lecture.status as LectureStatus];

      if (!allowedNext.includes(status)) {
        return res.status(400).json({
          message: `Invalid status transition from ${lecture.status} to ${status}`,
        });
      }

      if (status !== "completed") {
        shouldNotify = true;
      }

      if (status === "delayed") {
        lecture.delayReason = reason;
      }

      if (status === "cancelled") {
        lecture.cancelReason = reason;
      }

      if (["scheduled", "rescheduled"].includes(status)) {
        lecture.startTime = new Date(newStartTime);
      }

      lecture.status = status;
    }

    await lecture.save();

    if (shouldNotify) {
      /* ---------------- NOTIFICATION + EMAIL ---------------- */
      const payload: ClassUpdatePayload = {
        lectureId: lecture._id.toString(),
        classroomName: lecture.classroom.title || "no class", //@todo
        classroomId: lecture.classroom.toString(),
        title: lecture.title.toString(),
        status: lecture.status,
        startTime: lecture.startTime.toISOString(),
    };

      // socket emittor
      emitClassUpdate(payload);

      // email pub/subs
      //   await addClassNotificationJob({
      //     classroomId: lecture.classroom.toString(),
      //     lectureId: lecture._id.toString(),
      //     title: lecture.title,
      //     status: lecture.status,
      //   });
    }

    res.json({
      message: "Lecture updated successfully",
      lecture,
      success: true,
    });
  } catch (error) {
    handleError(res, error, "Failed to create lecture.");
  }
};

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
    const scheduledLectures = await Lecture.find({
      createdBy: req.userId,
      status: { $in: ["scheduled", "rescheduled", "delayed"] },
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

export const getAllScheduleLecturesForStudent = async (
  req: Request,
  res: Response
) => {
  try {
    const scheduledLectures = await Lecture.find({
      status: { $in: ["scheduled", "rescheduled", "delayed"] },
    })
      .populate({
        path: "classroom",
        match: { students: req.userId },
        select: "title",
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

export const getAllClassroomLectures = async (req: Request, res: Response) => {
  try {
    const classroom = await Classroom.findOne({
      _id: req.params.classroomId,
      // students: req.userId,
    });

    //@todo security check

    if (!classroom) {
      throw new Error("You are not enrolled in this classroom");
    }

    const myLectures = await Lecture.find({
      classroom: req.params.classroomId,
    }).sort({ startTime: 1 });

    return res.status(200).json({
      success: true,
      message: `Successfully fetched your lectures for classroom ${classroom.title}.`,
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
