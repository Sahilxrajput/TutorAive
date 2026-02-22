import { Request, Response, NextFunction } from "express";
import { authorizeOwner } from "../utils/authorization/authorizeOwner";

export const authorizeOwnerMiddleware =
  (resourceType: "lecture" | "assignment" | "classroom") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Ensure user is authenticated
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. User not authenticated.",
        });
      }

      // Map resource type to param name
      const paramMap = {
        lecture: "lectureId",
        assignment: "assignmentId",
        classroom: "classroomId",
      } as const;

      const rawId = req.params[paramMap[resourceType]] || req.params.id;

      if (!rawId || Array.isArray(rawId)) {
        return res.status(400).json({
          success: false,
          message: `${resourceType} id is required`,
        });
      }

      const resourceId = rawId; // 

      const resource = await authorizeOwner({
        resourceType,
        resourceId,
        userId: req.userId,
      });

      // attach resource for controller use
      req.authorizedResource = resource;

      next();
    } catch (err: any) {
      console.error("AuthorizeOwner Error:", err);

      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Authorization failed",
      });
    }
  };
