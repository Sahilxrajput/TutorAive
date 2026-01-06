import { Request, Response } from "express";
import User from "../models/user.model";
import Classroom from "../models/classroom.model";
import Lecture from "../models/lecture.model";
import { addClassNotificationJob } from "../redis/queue";
import {
  LectureUpdatePayload,
  IClassroom,
  INotification,
  LectureStatus,
  ILecture,
} from "../types/type";
import { emitLectureNotification } from "../sockets/class/class.emitter";
import { Notification } from "../models/notification.model";
import { Types } from "mongoose";

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
  delayed: ["rescheduled", "live", "cancelled"],
  live: ["completed"],
  completed: [],
  cancelled: [],
};

// --- Helper function for Authorization checks ---
type AuthorizeParams = {
  req: Request;
  res: Response;
  lectureId?: string;
  classroomId?: string;
};

export const authorizeOwner = async ({
  req,
  res,
  lectureId,
  classroomId,
}: AuthorizeParams) => {
  try {
    let item = null;

    // 1. Fetch based on what ID is provided
    if (lectureId) {
      item = await Lecture.findById(lectureId).populate("classroom");
    } else if (classroomId) {
      item = await Classroom.findById(classroomId);
    }

    // 2. Uniform Not Found Check
    if (!item) {
      const entity = lectureId ? "Lecture" : "Classroom";
      res.status(404).json({ success: false, message: `${entity} not found` });
      return null;
    }

    // 3. Authorization Logic
    // If it's a lecture, we check the owner of the lecture.
    // If it's a classroom, we check the owner of the classroom.
    const ownerId = item.createdBy?.toString();

    if (ownerId !== req.userId) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to modify this resource",
      });
      return null;
    }

    return item;
  } catch (error) {
    // Catching casting errors (e.g., invalid MongoDB ObjectIds)
    res
      .status(400)
      .json({ success: false, message: "Invalid ID format provided" });
    return null;
  }
};

export const createLecture = async (req: Request, res: Response) => {
  try {
    const { title, status, startTime, classroomId } = req.body;

    if (!title || !classroomId || !startTime || !status) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }

    const classroom = await authorizeOwner({ req, res, classroomId });
    if (!classroom) return;

    const newLecture = await Lecture.create({
      title,
      status,
      createdBy: req.userId,
      startTime,
      classroom: classroom._id,
    });

    // Attach classroom to lecture object for the notification helper
    newLecture.classroom = classroom;

    // Fire and forget background tasks
    addClassNotificationJob({
      classroomId,
      lectureId: newLecture._id.toString(),
      status,
      title,
    });

    return res.status(201).json({
      success: true,
      message: status === "live" ? "Lecture is live!" : "Lecture scheduled.",
      data: newLecture,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateLecture = async (req: Request, res: Response) => {
  try {
    const { status, title, newStartTime, delayTime, reason } = req.body;
    const { id: lectureId, classroomId } = req.params;

    console.log("classroomId: ", classroomId);
    console.log("lectureId: ", lectureId);
    console.log("status: ", status);
    console.log("title: ", title);

    const lecture = await authorizeOwner({
      req,
      res,
      lectureId,
    });
    if (!lecture) return;

    if (title && title !== lecture.title) {
      lecture.title = title;
    }
    if (title) lecture.title = title;

    let notificationTime: Date | undefined;

    if (status) {
      const allowedNext =
        ALLOWED_TRANSITIONS[lecture.status as LectureStatus] || [];
      if (!allowedNext.includes(status)) {
        return res
          .status(400)
          .json({ message: `Invalid transition to ${status}` });
      }

      if (status === "delayed" && delayTime) {
        lecture.startTime = new Date(
          lecture.startTime.getTime() + delayTime * 60000
        );
        lecture.delayReason = reason;
        notificationTime = lecture.startTime;
      }

      if (status === "cancelled") {
        lecture.cancelReason = reason;
      }

      if (status === "rescheduled" && newStartTime) {
        lecture.startTime = new Date(newStartTime);
        lecture.rescheduleReason = reason;
        notificationTime = lecture.startTime;
      }

      lecture.status = status;
    }

    await lecture.save();
    const newTime = lecture.newStartTime ?? lecture.startTime;

    // Fire and forget background tasks
    if (status && status !== "completed") {
      addClassNotificationJob({
        classroomId: lecture.classroom._id.toString(),
        lectureId: lecture._id.toString(),
        title: lecture.title,
        status: lecture.status,

        // send ONLY if meaningful
        ...(notificationTime && {
          startTime: notificationTime.toISOString(),
        }),
        ...(reason && { reason }),
      });
    }

    res.json({
      success: true,
      message: status
        ? `Lecture updated to ${lecture.status}`
        : `Lecture title changed to ${lecture.title}`,
      lecture,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteLecture = async (req: Request, res: Response) => {
  try {
    const lecture = await authorizeOwner({
      req,
      res,
      lectureId: req.params.id,
    });
    if (!lecture) return;

    await Lecture.findByIdAndDelete(lecture._id);

    return res.status(200).json({ success: true, message: "Lecture deleted." });
  } catch (error) {
    handleError(res, error);
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

    // 2. Authorization Check //@todo a middleware
    const isInstructor = classroom.createdBy.toString() === req.userId;
    const isStudent = classroom.students.some(
      (studentId: any) => studentId.toString() === req.userId
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
