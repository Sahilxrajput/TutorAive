import { Request, Response, NextFunction } from "express";
import { authorizeOwner } from "../utils/authorization/authorizeOwner";

export const authorizeOwnerMiddleware =
  (resourceType: "lecture" | "assignment" | "classroom") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resourceId =
        req.params.id ||
        req.params.assignmentId ||
        req.params.lectureId ||
        req.params.classroomId;

      const resource = await authorizeOwner({
        resourceType,
        resourceId,
        userId: req.userId,
      });

      req.authorizedResource = resource;
      next();
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message,
      });
    }
  };
