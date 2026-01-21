import 'express'

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      classroom?: IClassroom;
      userName?: string;
      userRole?: "student" | "instructor" | "admin";
      authorizedResource?: any;
    }
  }
}
export {}