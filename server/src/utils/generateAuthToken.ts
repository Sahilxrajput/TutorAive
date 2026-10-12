import jwt, { type SignOptions } from "jsonwebtoken";
import { IUser } from "../types/type";

export const generateAccessToken = (user: IUser): string => {
  const { _id, role, userName } = user;

  const expiresIn: SignOptions["expiresIn"] = (process.env
    .ACCESS_TOKEN_EXPIRES || "15m") as SignOptions["expiresIn"];

  return jwt.sign({ _id, role, userName }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn,
  });
};

export const generateRefreshToken = (user: IUser): string => {
  const { _id } = user;

  const expiresIn: SignOptions["expiresIn"] = (process.env
    .REFRESH_TOKEN_EXPIRES || "7d") as SignOptions["expiresIn"];

  return jwt.sign({ _id }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn });
};