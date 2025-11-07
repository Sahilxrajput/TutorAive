import jwt from "jsonwebtoken";
import { IUser } from "../types/type";

const generateAuthToken = (user: IUser) => {
  // @ts-ignore
  return jwt.sign(
    {
      _id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.TOKEN_EXPIRY || "1d" }
  );
};

export default generateAuthToken;
