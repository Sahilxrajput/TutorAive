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
  teacher: {
    _id: string;
    email: string;
    userName: string;
  };
  joinCode: string;
  tags: string[];
  modules?: number;
  hours?: number;
  syllabus: string[];
//   students: string[];
  students: IUser[];
  // assignments?: Types.ObjectId[];
  status: "active" | "archived" | "deleted";
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

export interface ISignupPayload {
  name: string;
  userName: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthContextValue {
  user: IUser | null;
  setUser: Dispatch<SetStateAction<IUser | null>>;
  isInstructor: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
  signout: () => Promise<void>;
  signin: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (credentials: ISignupPayload) => Promise<void>;
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
  createdBy?: {
    userName?: string;
    firstName: string;
  };
  delayReason?: string;
  cancelReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IResource {
  title: string;
  file: {
    url: string;
    public_id: string;
    resourceType?: string;
  };
  classroom: string;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

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
  classroom: string;
  title: string;
  description: string;
  dueDate: string;
  createdBy: string;
  file: {
    url: string;
    public_id: string;
    resource_type: string;
  };
  maxPoints?: number;
  createdAt: string;
  updatedAt: string;
}
export interface ISubmission {
  _id: string;
  assignment: IAssignment;
  status: "submitted" | "graded";
  student: string;
  file: {
    url: string;
    public_id: string;
    resource_type: string;
  };
  marks?: number;
  content?: number;
  feedback?: string;
  updatedAt: string;
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
