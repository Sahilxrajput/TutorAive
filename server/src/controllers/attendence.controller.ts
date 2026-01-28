import PDFDocument from "pdfkit";
import { Parser } from "json2csv";
import Attendance from "../models/attendence.model.";
import { Request, Response } from "express";
import Lecture from "../models/lecture.model";
import { Types } from "mongoose";

export const initializeAttendance = async (
  classroomId: string,
  lectureId: string,
  students: string[],
) => {
  const ops = students.map((studentId) => ({
    updateOne: {
      filter: { classroom: classroomId, lectureId, student: studentId },
      update: {
        status: "absent",
        sessionDate: new Date(),
      },
      upsert: true,
    },
  }));

  await Attendance.bulkWrite(ops);
};

export const exportAttendancePDF = async (req: Request, res: Response) => {
  const data = await Attendance.find({
    lectureId: req.params.lectureId,
  }).populate("student", "name");

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  doc.pipe(res);

  doc.fontSize(18).text("Attendance Report\n\n");

  data.forEach((a) => {
    doc.fontSize(12).text(`${a.student.name} - ${a.status.toUpperCase()}`);
  });

  doc.end();
};

export const exportAttendanceCSV = async (req: Request, res: Response) => {
  const data = await Attendance.find({
    lectureId: req.params.lectureId,
  }).populate("student", "name email");

  const parser = new Parser({
    fields: ["student.name", "student.email", "status", "joinTime"],
  });

  const csv = parser.parse(data);
  res.header("Content-Type", "text/csv");
  res.attachment("attendance.csv");
  res.send(csv);
};

export const attendenceLock = async (req: Request, res: Response) => {
  await Lecture.findByIdAndUpdate(req.params.lectureId, {
    isAttendanceLocked: true,
  });

  res.json({ success: true });
};

export const attendenceAggregation = async (req: Request, res: Response) => {
  const { classroomId, studentId } = req.params;
  const data = await Attendance.aggregate([
    {
      $match: {
        classroom: new Types.ObjectId(classroomId as string),
        student: new Types.ObjectId(studentId as string),
      },
    },
    {
      $group: {
        _id: "$student",
        total: { $sum: 1 },
        present: {
          $sum: {
            $cond: [{ $ne: ["$status", "absent"] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        percentage: {
          $multiply: [{ $divide: ["$present", "$total"] }, 100],
        },
      },
    },
  ]);

  res.json(data[0] || { percentage: 0 });
};

export const startLecture = async (req: Request, res: Response) => {
  const { classroomId, lectureId, students } = req.body;

  const records = students.map((studentId: string | Types.ObjectId) => ({
    classroom: classroomId,
    lecture: lectureId,
    student: studentId,
    status: "absent",
    sessionDate: new Date(),
  }));

  await Attendance.insertMany(records);

  res.json({ success: true });
};

export const markAttendance = async (req:Request, res:Response) => {
  try {
    const { lecture, student, status } = req.body;

    if (!lecture || !student || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const attendance = await Attendance.findOneAndUpdate(
      { lecture, student },
      {
        status,
        markedBy: req.userId, // teacher
        markedAt: new Date(),
      },
      { upsert: true, new: true },
    );

    res.status(200).json(attendance);
  } catch (err:any) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Attendance already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};

export const getLectureAttendance = async (req:Request, res:Response) => {
  try {
    const { lectureId } = req.params;

    const attendance = await Attendance.find({ lecture: lectureId }).populate(
      "student",
      "name email",
    );

    res.status(200).json(attendance);
  } catch (err:any) {
    res.status(500).json({ message: err.message });
  }
};

export const getStudentAttendance = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const attendance = await Attendance.find({ student: studentId }).populate(
      "lecture",
      "title date",
    );

    res.status(200).json(attendance);
  } catch (err:any) {
    res.status(500).json({ message: err.message });
  }
};
