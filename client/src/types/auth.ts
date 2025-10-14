export interface IUser {
  _id: string;
  firstName: string;
  username?:string,
  lastName?: string;
  email: string;
  profilePicture?: string;
}

export interface AuthContextValue {
  user: IUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  login: (credentials: { email: string; password: string }) => Promise<void>;
}
