import { Request, Response } from "express";
import Assignment from "../models/assignment.model";
import Classroom from "../models/classroom.model";
import Submission from "../models/submission.model";
import {
  IAssignment,
  IClassroom,
  INotification,
  ISubmission,
} from "../types/type";
import { cloudinary } from "../lib/cloudinary";
import { addAssignmentNotificationJob } from "../redis/queue";

// --- Helper function for Authorization checks ---
type AuthorizeParams = {
  req: Request;
  res: Response;
  assignmentId?: string;
  classroomId?: string;
};

export const authorizeOwner = async ({
  req,
  res,
  assignmentId,
  classroomId,
}: AuthorizeParams) => {
  try {
    let item = null;

    // 1. Fetch based on what ID is provided
    if (assignmentId) {
      item = await Assignment.findById(assignmentId).populate("classroom");
    } else if (classroomId) {
      item = await Classroom.findById(classroomId);
    }

    // 2. Uniform Not Found Check
    if (!item) {
      const entity = assignmentId ? "Assignment" : "Classroom";
      res.status(404).json({ success: false, message: `${entity} not found` });
      return null;
    }

    // 3. Authorization Logic
    // If it's a assignment, we check the owner of the assignment.
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

export const cloudinarySignature = async (req: Request, res: Response) => {
  try {
    const { CLOUD_API_KEY, CLOUD_NAME, CLOUD_API_SECRET } = process.env;
    const { classroomId } = req.params;

    const classroom = await authorizeOwner({
      req,
      res,
      classroomId,
    });
    if (!classroom) return;

    const timestamp = Math.floor(Date.now() / 1000);
    // const folder = "tweets";
    const folder = "assignment files";

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      CLOUD_API_SECRET!
    );

    return res.json({
      timestamp,
      signature,
      cloudName: CLOUD_NAME!,
      apiKey: CLOUD_API_KEY!,
      folder,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to generate Cloudinary signature",
    });
  }
};

export const saveAssignment = async (req: Request, res: Response) => {
  try {
    const {
      pdfUrl,
      public_id,
      title,
      description,
      dueDate,
      resource_type,
      maxPoints,
    } = req.body;

    const { classroomId } = req.params;

    // 1. Authorization Check
    const classroomDoc = await authorizeOwner({ req, res, classroomId });
    if (!classroomDoc) return;

    // 2. Create Assignment
    const assignment = await Assignment.create({
      classroom: classroomId,
      title,
      description,
      dueDate: new Date(dueDate),
      createdBy: req.userId,
      maxPoints: Number(maxPoints) || 0,
      file: {
        url: pdfUrl,
        public_id,
        resource_type,
      },
    });

    // Message Queue (Email/Push Notifications)
    await addAssignmentNotificationJob({
      classroomId: classroomDoc._id.toString(),
      classroomTitle: classroomDoc.title,
      assignmentId: assignment._id.toString(),
      title: assignment.title,
      dueDate,
    });

    return res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: assignment,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to create assignment",
    });
  }
};

export const getAssignmentsOfStudent = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { studentId } = req.params;

    //@todo move it to a middleware
    if (studentId !== userId && req.userRole !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "you are not authorized to check it",
      });
    }

    // Find classrooms where the user is a member
    const classrooms = await Classroom.find({ students: userId }).select("_id");

    if (!classrooms.length)
      return res
        .status(404)
        .json({ message: "User is not enrolled in any classroom." });

    const classroomIds = classrooms.map((c) => c._id);

    // 2. Fetch assignments for all those classrooms
    const assignments = await Assignment.find({
      classroom: { $in: classroomIds },
    });

    // 3. Get all submissions by this student for these classroom
    const submissions = await Submission.find({ student: studentId });

    // Convert submitted assignment IDs into a Set for fast lookup
    const submittedIds = new Set(
      submissions.map((s: ISubmission) => s.assignment.toString())
    );

    // 3. Split into pending + submitted
    const submitted = assignments.filter((a) =>
      submittedIds.has(a._id.toString())
    );

    const pending = assignments.filter(
      (a) => !submittedIds.has(a._id.toString())
    );

    res.status(200).json({
      success: true,
      submitted,
      pending,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching assignments.",
    });
  }
};

export const getAssignmentsForInstructor = async (
  req: Request,
  res: Response
) => {
  try {
    const assignments = await Assignment.find({
      createdBy: req.userId,
    })
      .populate("classroom", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Fetched teacher assignments",
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getStudentAssignmentsInClassroom = async (
  req: Request,
  res: Response
) => {
  try {
    const { classroomId, studentId } = req.params;

    // 1. Get all assignments for the classroom
    const assignments = await Assignment.find({ classroom: classroomId });

    // 2. Get all submissions by this student for this classroom
    const submissions = await Submission.find({ student: studentId });

    // Convert submitted assignment IDs into a Set for fast lookup
    const submittedIds = new Set(
      submissions.map((s: ISubmission) => s.assignment.toString())
    );

    // 3. Split into pending + submitted
    const submitted = assignments.filter((a) =>
      submittedIds.has(a._id.toString())
    );

    const pending = assignments.filter(
      (a) => !submittedIds.has(a._id.toString())
    );

    res.status(200).json({
      success: true,
      submitted,
      pending,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message });
  }
};

// Get single assignment
export const getAssignmentById = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });
    res.json({ success: true, data: assignment });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//get all assignment of a classroom
export const getAssignmentsByClassroomId = async (
  req: Request,
  res: Response
) => {
  try {
    const classroom = await authorizeOwner({
      req,
      res,
      classroomId: req.params.classroomId,
    });
    if (!classroom) return;

    const assignments = await Assignment.find({
      classroom: req.params.classroomId,
    });

    if (!assignments)
      return res.status(404).json({ message: "Assignment not found" });

    res.status(200).json({ data: assignments, success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Delete assignment (instructor only)
export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await authorizeOwner({
      req,
      res,
      assignmentId: req.params.id,
    });
    if (!assignment) return;

    // Delete Cloudinary image if exists
    if (assignment?.file?.public_id) {
      await cloudinary.uploader.destroy(assignment.file.public_id);
    }

    await Assignment.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Assignment deleted successfully" });

    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    await assignment.deleteOne();
    res.json({ message: "Assignment deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

//@todo
export const updateAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (assignment.createdBy.toString() !== req.userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this assignmnet" });
    }

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const updated = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: (error as Error).message,
    });
  }
};

// export const getAllAssignmentsInClassroom = async (req: Request, res: Response) => {
//   try {
//     const { classroomId } = req.params;
//     const studentId = req.userId;

//     if (!mongoose.Types.ObjectId.isValid(classroomId)) {
//       return res.status(400).json({ message: "Invalid classroom id" });
//     }

//     const assignments = await Assignment.aggregate([
//       // 1. Match classroom
//       {
//         $match: {
//           classroom: new mongoose.Types.ObjectId(classroomId),
//         },
//       },

//       // 2. Lookup student's submission
//       {
//         $lookup: {
//           from: "submissions",
//           let: { assignmentId: "$_id" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ["$assignment", "$$assignmentId"] },
//                     {
//                       $eq: ["$student", new mongoose.Types.ObjectId(studentId)],
//                     },
//                   ],
//                 },
//               },
//             },
//           ],
//           as: "mySubmission",
//         },
//       },

//       // 3. Add submission flags
//       {
//         $addFields: {
//           isSubmitted: { $gt: [{ $size: "$mySubmission" }, 0] },
//           submissionId: { $arrayElemAt: ["$mySubmission._id", 0] },
//           submittedAt: { $arrayElemAt: ["$mySubmission.createdAt", 0] },
//         },
//       },

//       // 4. Cleanup
//       {
//         $project: {
//           mySubmission: 0,
//         },
//       },

//       // 5. Sort by due date (optional but useful)
//       {
//         $sort: { dueDate: 1 },
//       },
//     ]);

//     // 6. Split result
//     const submitted = [];
//     const pending = [];

//     for (const a of assignments) {
//       a.isSubmitted ? submitted.push(a) : pending.push(a);
//     }

//     return res.status(200).json({
//       success: true,
//       data: {
//         submitted,
//         pending,
//       },
//     });
//   } catch (error) {
//     console.error("Assignment status fetch error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch assignments",
//     });
//   }
// };
