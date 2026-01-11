import { JwtPayload } from "jsonwebtoken";
import { Document, Types } from "mongoose";

export interface MyJwtPayload extends JwtPayload {
  _id: string;
  email: string;
  profileImage?: string;
}
export interface IUser {
  // _id?:string;
  _id: Types.ObjectId;
  firstName: string;
  lastName?: string;
  userName?: string;
  oauthProvider?: string;
  oauthId?: string;
  profilePicture?: string;
  email: string;
  refreshToken?: string;
  password?: string;
  assignments?: Types.ObjectId[];
  notes?: Types.ObjectId[];
  enrolledClassrooms?: Types.ObjectId[];
  role: "student" | "instructor" | "admin";
}

export interface INotification extends Document {
  user: Types.ObjectId;
  type: "lecture" | "assignment" | "message" | "system";
  message: string;
  data?: {
    classroomId?: Types.ObjectId;
    lectureId?: Types.ObjectId;
    tweetId?: Types.ObjectId;
    assignmentId?: Types.ObjectId;
    reason?: string;
  };
  isRead: boolean;
  createdAt: Date;
}

export interface IAssignment extends Document {
  classroom: Types.ObjectId;
  title: string;
  description?: string;
  dueDate: Date;
  createdBy: Types.ObjectId;
  maxPoints?: number;
  file?: {
    url: string;
    public_id: string;
    resource_type?: string;
  };
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
  //   assignments?: Types.ObjectId[];
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
export interface ILecture extends Document {
  classroom: Types.ObjectId;
  title: string;
  description?: string;
  startTime: Date; // first session start
  endTime?: Date; // optional end time for the first session
  recurrenceRule?: string; // e.g., "RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR"
  createdBy: Types.ObjectId;
  status:
    | "scheduled"
    | "rescheduled"
    | "live"
    | "completed"
    | "delayed"
    | "cancelled";
  delayReason: string;
  cancelReason: string;
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
  status: "submitted" | "graded";
  student: Types.ObjectId;
  file: {
    url: string;
    public_id: string;
    resource_type: string;
  };
  content?: string;
  submittedAt: Date;
  marks?: number; // optional grade
  feedback?: string;
}
export interface IVideoParticipant {
  user: Types.ObjectId;
  joinAt: Date;
  leaveAt: Date;
  role: "student" | "instructor" | "admin";
}
export interface ILiveSession extends Document {
  classroom?: Types.ObjectId;
  title?: string;
  meatingCode: string;
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
//@todo TEST
export interface INote extends Document {
  _id: Types.ObjectId;
  content: object;
  title: String;
  isPublic: boolean;
  owner: Types.ObjectId;
  pinnedBy: IUser[];
  status: "active" | "archived" | "trashed";
  trashedAt?: Date | null;
  collaborators: ICollaborator[];
  classroom?: IClassroom | Types.ObjectId;
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

export interface ITweet extends Document {
  author: Types.ObjectId;
  type: "general" | "mentorship" | "news" | "problem";
  content: String;
  image?: {
    url: string;
    public_id: string;
  };
  likes?: Types.ObjectId[];
  mentions?: Types.ObjectId[];
  parentTweet?: Types.ObjectId;
}

export type LectureStatus =
  | "scheduled"
  | "rescheduled"
  | "live"
  | "delayed"
  | "completed"
  | "cancelled";

export interface LectureUpdatePayload {
  lectureId: string;
  studentId: string;
  classroomTitle: string;
  classroomId: string;
  title: string;
  status: LectureStatus;
  startTime?: string;
  reason?: string;
  
}

export interface AssignmentPayload {
  assignmentId: string;
  studentId: string;
  classroomId: string;
  classroomTitle: string;
  title: string;
  dueDate: Date;
}

export interface ITweetPayload {
  msg: string;
  userId: string;
  tweetId: string;
}

export interface ITweetNotificationJob {
  userId: string; // receiver of notification
  tweetId: string;
  actorName: string; // who performed the action
  action: "mention" | "like" | "repost";
}

export interface IAssignmentNotificationJob {
  classroomId: string;
  classroomTitle: string;
  assignmentId: string;
  title: string;
  dueDate: string;
}

export interface IClassNotificationJob {
  classroomId: string;
  lectureId: string;
  title: string;
  startTime: string;
  reason?: string; // !@fix check createLecture controller
  status: LectureStatus;
}
