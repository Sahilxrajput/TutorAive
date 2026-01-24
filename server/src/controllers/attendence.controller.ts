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
