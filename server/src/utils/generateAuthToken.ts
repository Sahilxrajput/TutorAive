import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";

const generateAuthToken = (user: IUser) => {
  // @ts-ignore
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      profileImage: user.profilePicture,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.TOKEN_EXPIRY || "1d" }
  );
};

export default generateAuthToken;
