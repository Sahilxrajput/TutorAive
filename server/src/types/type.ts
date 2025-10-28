import { JwtPayload } from "jsonwebtoken";
import { Document, Types } from "mongoose";

export interface MyJwtPayload extends JwtPayload {
  _id: string;
  email: string;
  profileImage?: string;
}
export interface IUser  {
  _id?:string;
  firstName: string;
  lastName?: string;
  userName?: string;
  oauthProvider?: string;
  oauthId?: string;
  profilePicture?: string;
  email: string;
  password?: string;
  assignments?: Types.ObjectId[];
  enrolledClassrooms?: Types.ObjectId[];
  role: "student" | "instructor" | "admin";
}
export interface IAssignment extends Document {
  classroom: Types.ObjectId;
  title: string;
  description?: string;
  dueDate: Date;
  createdBy: Types.ObjectId;
  maxPoints?: number;
  status: "pending" | "submitted";
  createdAt: Date;
  updatedAt: Date;
}
export interface IAttendance extends Document {
  classroom: Types.ObjectId;
  student: Types.ObjectId;
  date: Date;
  status: "present" | "absent";
}
export interface IClassroom extends Document {
  title: string;
  description?: string;
  price?: Number;
  isPublic: boolean;
  createdBy: Types.ObjectId;
  joinCode: string;
  tags: string[];
  modules?: Number;
  hours?: Number;
  curriculum: Object[];
  syllabus: Object[];
  students?: Types.ObjectId[];
  memberships?: Types.ObjectId[];
  assignments?: Types.ObjectId[];
  schedules?: Types.ObjectId[];
  invitations?: Types.ObjectId[];
  attendance?: Types.ObjectId[];
  overview?: {};
  status: "active" | "archived" | "deleted";
  settings?: {
    maxStudents: number;
    allowGuests: boolean;
    chatEnabled: boolean;
    codeEditorEnabled: boolean;
    canvasEnabled: boolean;
  };
  paid: boolean;
}
export interface IClassSchedule extends Document {
  classroom: Types.ObjectId;
  title: string;
  description?: string;
  startTime: Date; // first session start
  endTime?: Date; // optional end time for the first session
  recurrenceRule?: string; // e.g., "RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR"
  createdBy: Types.ObjectId;
  status: "scheduled" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}
export interface IClassInvitation extends Document {
  classroom: Types.ObjectId;
  createdBy: Types.ObjectId;
  inviteCode: string; // short unique code
  expiresAt?: Date;
  maxUses?: number; // optional usage limit
  usedBy: Types.ObjectId[]; // track which users have used it
  createdAt: Date;
  updatedAt: Date;
}
export interface ISubmission extends Document {
  assignment: Types.ObjectId;
  student: Types.ObjectId;
  files?: string[]; // array of file URLs
  content?: string;
  submittedAt: Date;
  grade?: number; // optional grade
  feedback?: string;
}
export interface IVideoParticipant {
  user: Types.ObjectId;
  joinAt: Date;
  leaveAt: Date;
  role: "student" | "instructor" | "admin";
}
export interface IVideoSession extends Document {
  classroom?: Types.ObjectId;
  title?: string;
  createdBy?: Types.ObjectId;
  startedAt: Date;
  endedAt?: Date;
  provider?: string;
  providerRoomId?: string;
  participants?: IVideoParticipant[];
  isRecorded?: boolean;
  meta?: Record<string, any>; // or use a more specific type if known
}
export interface ICollaborator {
  user: IUser | Types.ObjectId;
  access: "view" | "edit";
}
//TODO TEST
export interface INote extends Document {
  title: string;
  content: string;
  color?: string;
  visibility: "private" | "public" | "classroom";
  owner: Types.ObjectId;
  pinnedAt?: Date | null;
  status: "active" | "archived" | "trashed";
  trashedAt?: Date | null;
  collaborators: ICollaborator[];
  classroom?: IClassroom | Types.ObjectId;
  attachments?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEnrollment extends Document {
  user: Types.ObjectId;
  classroom?: Types.ObjectId;
  status: "pending" | "success" | "failed";
  paymentId?: String;
  orderId?: String;
  amount: Number;
}
