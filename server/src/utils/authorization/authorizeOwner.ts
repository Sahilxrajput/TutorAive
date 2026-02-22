import mongoose from "mongoose";
import Lecture from "../../models/lecture.model";
import Assignment from "../../models/assignment.model";
import { Classroom } from "../../models/classroom.model";

type ResourceType = "lecture" | "assignment" | "classroom";

interface AuthorizeParams {
  resourceType: ResourceType;
  resourceId: string;
  userId: string;
}

export const authorizeOwner = async ({
  resourceType,
  resourceId,
  userId,
}: AuthorizeParams) => {
  try {
    let resource: any = null;
    let teacherId: string | null = null;

    // ───────── LECTURE ─────────
    if (resourceType === "lecture") {
      resource = await Lecture.findById(resourceId).populate(
        "classroom",
        "teacher",
      );

      if (!resource) {
        throw { status: 404, message: "Lecture not found" };
      }

      teacherId = resource.createdBy?.toString();
    }

    // ───────── ASSIGNMENT ─────────
    else if (resourceType === "assignment") {
      resource = await Assignment.findById(resourceId).populate(
        "classroom",
        "teacher",
      );

      if (!resource) {
        throw { status: 404, message: "Assignment not found" };
      }

      teacherId = resource.createdBy?.toString();
    }

    // ───────── CLASSROOM ─────────
    else if (resourceType === "classroom") {
      resource = await Classroom.findById(resourceId);

      if (!resource) {
        throw { status: 404, message: "Classroom not found" };
      }

      teacherId = resource.teacher?.toString();
    }

    if (!teacherId) {
      throw { status: 500, message: "Teacher reference missing" };
    }

    // Ownership check
    if (teacherId !== userId) {
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
