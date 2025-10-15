import { Request, Response, NextFunction } from "express";

export default function isInstructor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.userId as { role?: string };

    if (!user) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    if (user.role !== "instructor") {
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
}
