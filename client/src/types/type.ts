export interface IUser {
  _id: string;
  role: string;
  firstName: string;
  userName?: string;
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

export interface ISaveNote{
  title: string;
  content: string;
  classroom?: string;
}

export interface INote {
  _id: string;
  title: string;
  content: string;
  // color?: string;
  pinnedAt?: Date | null;
  status: "active" | "archived" | "trashed";
  visibility: "private" | "public" | "collaborative"; //@remind
  owner: string;
  trashedAt?: Date | null;
  collaborators: { user: string; access: "view" | "edit" }[];
  classroom?: string;
  updatedAt: string;
  createdAt: string;
}

export interface IDocs {
  _id: string;
  content: object;
  pinnedAt?: Date | null;
  status: "active" | "archived" | "trashed";
  visibility: "private" | "public" | "collaborative";
  owner: string;
  trashedAt?: Date | null;
  collaborators: { user: string; access: "view" | "edit" }[];
  classroom?: string;
  createdAt?: Date;
  updatedAt?: Date;
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

export interface IAddTweetContext {
  previousTweets: ITweet[];
}

export interface ITweet {
  _id: string;
  content: string;
  type: "general" | "mentorship" | "news" | "problem" | "repost";
  parentTweet?: {
    author: IUser;
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
