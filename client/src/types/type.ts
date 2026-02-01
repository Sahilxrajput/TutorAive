import type useSocket from "@/hooks/useSocketHandler";
import type { Dispatch, SetStateAction } from "react";

export interface IUser {
  _id: string;
  role: string;
  firstName: string;
  userName?: string;
  lastName?: string;
  email: string;
  enrolledClassrooms: string[];
  profilePicture?: string;
  refreshToken?: string;
}

export interface INotification {
  _id: string;
  user: string;
  type: "lecture" | "assignment" | "message" | "system";
  message: string;
  data?: {
    classroomId?: string;
    lectureId?: string;
    tweetId?: string;
    assignmentId?: string;
  };
  isRead: boolean;
  createdAt: Date;
}

export interface ISocketContextValue {
  socket: ReturnType<typeof useSocket>["socket"];
  isConnected: boolean;
  onlineUsers: ReturnType<typeof useSocket>["onlineUsers"];
  sendMessage: ReturnType<typeof useSocket>["sendMessage"];
  disconnectSocket: ReturnType<typeof useSocket>["disconnectSocket"];
  reconnectSocket: ReturnType<typeof useSocket>["reconnectSocket"];
}

export interface IClassroom {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  isPublic: boolean;
  createdBy: string;
  joinCode: string;
  tags: string[];
  modules?: number;
  hours?: number;
  // curriculum: Object[];
  syllabus: string[];
  // students?: Types.ObjectId[];
  // memberships?: Types.ObjectId[];
  // assignments?: Types.ObjectId[];
  // schedules?: Types.ObjectId[];
  // invitations?: Types.ObjectId[];
  // attendance?: Types.ObjectId[];
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

// export interface IAssignment extends Document {
//   classroom: Types.ObjectId;
//   title: string;
//   description?: string;
//   dueDate: Date;
//   createdBy: Types.ObjectId;
//   maxPoints?: number;
//   attachment?: string;
//   status: "pending" | "submitted";
//   createdAt: Date;
//   updatedAt: Date;
// }
export interface AuthContextValue {
  user: IUser | null;
  setUser: Dispatch<SetStateAction<IUser | null>>;
  isInstructor: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
  signout: () => Promise<void>;
  signin: (credentials: { email: string; password: string }) => Promise<void>;
}

export interface ISaveNote {
  prevNotes: INote[];
}

export interface IAddCollaborator {
  noteId: string;
  userEmail: string;
  access: string;
}

export interface IRemoveCollaborator {
  noteId: string;
  userId: string;
}

export interface INote {
  _id: string;
  title: string;
  content: INoteContent[];
  owner: {
    _id: string;
    userName: string;
    lastName?: string;
    firstName?: string;
    profilePicture?: string;
    email: string;
  };
  status: "active" | "archived" | "trashed";
  isPublic: boolean;
  collaborators: {
    user: {
      _id: string;
      userName: string;
      profilePicture?: string;
      email: string;
    };
    access: "view" | "edit";
  }[];
  pinnedBy: string[];
  isPinned?: boolean;
  trashedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface INoteContent {
  type: string;
  attrs?: {
    textAlign?: string | null;
    level?: number;
    [key: string]: any;
  };
  content?: Array<{
    type?: string;
    text?: string;
    attrs?: any;
    [key: string]: any;
  }>;
}

export interface ILecture {
  _id: string;
  classroom: {
    title: string;
    _id: string;
  };
  startTime: string;
  newStartTime: string;
  status:
    | "scheduled"
    | "rescheduled"
    | "live"
    | "delayed"
    | "completed"
    | "cancelled";
  title: string;
  createdBy?: string;
  delayReason?: string;
  cancelReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Example of how you might use this in your Service
export interface ILectureWOPopulate {
  _id: string;
  classroom: string; // Now stores only the classroom ID
  startTime: string;
  newStartTime: string;
  status:
    | "scheduled"
    | "rescheduled"
    | "live"
    | "delayed"
    | "completed"
    | "cancelled";
  title: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAddTweetContext {
  previousTweets: ITweet[];
}

export interface ITweet {
  _id: string;
  content: string;
  type: "general" | "mentorship" | "news" | "problem" | "repost";
  parentTweet?: {
    author: IUser; //! @fix make it only string
    content: string;
    image?: {
      url: string;
      public_id: string;
    };
  };
  image?: {
    url: string;
    public_id: string;
  };
  author: IUser;
  // classroom?: string; // @fix
  likes?: string[];
  createdAt: string;
  // timeStr: string;
  // dateStr: string;
}

export interface IAssignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  createdBy: string;
  maxPoints?: number;
  attachment: string;
  status: "pending" | "submitted";
  createdAt: string;
  updatedAt: string;
  classroom: string;
}

export type ClassStatus =
  | "live"
  //   | "starting_soon"
  | "scheduled"
  | "rescheduled"
  | "delayed"
  | "cancelled";

export interface LectureUpdatePayload {
  lectureId: string;
  classroomId: string;
  title: string;
  status: ClassStatus;
  startTime: string;
  reason?: string;
}

export interface AssignmentPayload {
  assignmentId: string;
  classroomId: string;
  title: string;
  dueDate: Date;
}
