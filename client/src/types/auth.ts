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

export interface AuthContextValue {
  user: IUser | null;
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
