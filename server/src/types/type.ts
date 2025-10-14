import { JwtPayload } from "jsonwebtoken";

export interface MyJwtPayload extends JwtPayload {
  _id: string;
  email: string;
  profileImage?: string;
}
