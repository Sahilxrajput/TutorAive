export interface IUser {
  _id: string;
  role: string;
  firstName: string;
  username?: string;
  lastName?: string;
  email: string;
  enrolledClassrooms: string[];
  profilePicture?: string;
}

export interface IClassroom {
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
  isInstructor: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  login: (credentials: { email: string; password: string }) => Promise<void>;
}

export interface INote {
  _id: string;
  title: string;
  content: string;
  color: string;
  pinnedAt?: Date | null;
  status: "active" | "archived" | "trashed";
  visibility: "private" | "public" | "collaborative";
  owner: string;
  collaborators: { user: string; access: "view" | "edit" }[];
  updatedAt: string;
  createdAt: string;
}

export interface ILecture {
  _id: string;
  classroom: {
    title: string;
    _id: string;
  };
  dateStr?: string;
  startTime?: string;
  timeStr?: string;
  status: "scheduled" | "completed" | "cancelled";
  title: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITweet {
  _id: string;
  title: string;
  content: string;
  type: "general" | "mentorship" | "news" | "problem";
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    userName: string;
    profilePicture?: string;
  };
  classroom: string; // @fix
  likes: string[];
  createdAt: string;
  timeStr: string;
  dateStr: string;
}
