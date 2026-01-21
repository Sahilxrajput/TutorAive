import mongoose from "mongoose";
import Lecture from "../../models/lecture.model";
import Assignment from "../../models/assignment.model";
import { Classroom } from "../../models/classroom.model";

type ResourceType = "lecture" | "assignment" | "classroom";

interface AuthorizeParams {
  resourceType: ResourceType;
  resourceId: string;
  userId?: string;
}

export const authorizeOwner = async ({
  resourceType,
  resourceId,
  userId,
}: AuthorizeParams) => {
  if (!userId) {
    throw { status: 401, message: "Unauthorized" };
  }

  if (!resourceId) {
    throw { status: 400, message: "Resource ID is required" };
  }

  try {
    let classroomId: string | null = null;
    let resource: any = null;

    // ───────── LECTURE ─────────
    if (resourceType === "lecture") {
        console.log("resourceId:", resourceId);
        resource = await Lecture.findById(resourceId).populate("classroom");
        console.log("resource:", resource);
    
      if (!resource) {
        throw { status: 404, message: "Lecture not found" };
      }

      classroomId = resource.classroom?._id;
    }

    // ───────── ASSIGNMENT ─────────
    else if (resourceType === "assignment") {
      resource = await Assignment.findById(resourceId).populate("classroom");

      if (!resource) {
        throw { status: 404, message: "Assignment not found" };
      }

      classroomId = resource.classroom?._id;
    }

    // ───────── CLASSROOM ─────────
    else if (resourceType === "classroom") {
      resource = await Classroom.findById(resourceId);

      if (!resource) {
        throw { status: 404, message: "Classroom not found" };
      }

      classroomId = resource._id;
    }

    if (!classroomId) {
      throw { status: 500, message: "Classroom reference missing" };
    }

    const classroom = await Classroom.findById(classroomId);

    if (!classroom) {
      throw { status: 404, message: "Classroom not found" };
    }

    if (classroom.teacher.toString() !== userId) {
      throw {
        status: 403,
        message: "You do not have permission to modify this resource",
      };
    }

    return resource;
  } catch (error: any) {
    if (error instanceof mongoose.Error.CastError) {
      throw { status: 400, message: "Invalid ID format" };
    }

    if (error?.status) {
      throw error;
    }

    throw { status: 500, message: "Internal server error" };
  }
};
