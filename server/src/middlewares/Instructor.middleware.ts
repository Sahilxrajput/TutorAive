import { Request, Response, NextFunction } from "express";


export const isInstructor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.userRole !== "instructor") {
      return res
        .status(403)
        .json({ message: "Access denied. Instructors only." });
    }

    next();
  } catch (error) {
    console.error("isInstructor middleware error:", error);
    return res
      .status(500)
      .json({ message: "Server error verifying instructor role." });
  }
};


