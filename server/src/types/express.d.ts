import "express";

declare global {
  namespace Express {
    interface User extends IUser {}
    interface Request {
      userId?: string;
      classroom?: IClassroom;
      userName?: string;
      userRole?: "student" | "instructor" | "admin";
      authorizedResource?: any;
    }
  }
}
export {};
