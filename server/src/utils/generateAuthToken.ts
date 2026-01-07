import jwt from "jsonwebtoken";
import { IUser } from "../types/type";

export const generateAccessToken = ({
  _id,
  role,
  userName,
}: {
  _id: string;
  role: string;
  userName: string;
}) => {
  // @ts-ignore
  return jwt.sign({ _id, role, userName }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m",
  });
};

export const generateRefreshToken = ({
  _id,
  role,
  userName,
}: {
  _id: string;
  role: string;
  userName: string;
}) => {
  // @ts-ignore
  return jwt.sign({ _id, role, userName }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d",
  });
};
