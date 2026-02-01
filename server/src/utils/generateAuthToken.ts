import jwt from "jsonwebtoken";
import { IUser } from "../types/type";

export const generateAccessToken = (user: IUser) => {
  const { _id, role, userName } = user;
  // @ts-ignore
  return jwt.sign({ _id, role, userName }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m",
  });
};

export const generateRefreshToken = (user: IUser) => {
  const { _id } = user;
  // @ts-ignore
  return jwt.sign({ _id }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d",
  });
};
