import { Request, Response } from "express";
import Attendance from "../models/attendence.model.";
import { Classroom } from "../models/classroom.model";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateAuthToken";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser, MyJwtPayload } from "../types/type";
import { HydratedDocument } from "mongoose";

const isProduction = process.env.NODE_ENV === "production";

const googleCallback = async (req: Request, res: Response) => {
  const user = req.user as HydratedDocument<IUser>;
  const role = (req as any).role || "student";

  // set role only if new user or role not assigned
  if (!user.role) {
    user.role = role;
  }

  // generate tokens
  const refreshToken = generateRefreshToken(user);
  const accessToken = generateAccessToken(user);

  // store hashed refresh token
  user.refreshToken = await bcrypt.hash(refreshToken, 12);
  await user.save();

  // set refresh cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction, // force true in production
    sameSite: "none", // required for cross-site OAuth
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // redirect to frontend
  res.redirect(
    `${process.env.CLIENT_URL}/auth/success?accessToken=${accessToken}`,
  );
};


const signup = async (req: Request, res: Response) => {
  try {
    let { email, name, userName, password, role } = req.body;

    // Check email
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(409).json({
        field: "email",
        message: "Email is already registered",
      });
    }

    const parts = name.trim().split(" ");

    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";

    // Check username
    const usernameExists = await User.findOne({ userName });
    if (usernameExists) {
      return res.status(409).json({
        field: "userName",
        message: "This username is already taken",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const savedUser = await User.create({
      email,
      userName,
      firstName,
      lastName,
      role,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken(savedUser);
    const refreshToken = generateRefreshToken(savedUser);

    savedUser.refreshToken = await bcrypt.hash(refreshToken, 12);
    await savedUser.save();

    const { password: _, refreshToken: __, ...userData } = savedUser.toObject();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "signup successfully",
      user: userData,
      accessToken,
    });
  } catch (err: any) {
    // Backup safety net for race conditions
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({
        field,
        message: `${field} already exists`,
      });
    }

    console.error("Signup error:", err);
    res.status(500).json({
      message: "Failed to create user",
    });
  }
};

const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 1️. Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 2️. Store hash refresh token in DB
    user.refreshToken = await bcrypt.hash(refreshToken, 12);
    await user.save();

    // 3️. Send refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "none",  
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 4️. Remove sensitive fields
    const { password: _, refreshToken: __, ...userData } = user.toObject();

    // 5️. Send access token in response body
    return res.status(200).json({
      message: "Login successful",
      user: userData,
      accessToken,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const loginfailed = (_req: Request, res: Response) => {
  return res.status(401).json({ success: false, message: "Login failed" });
};

const signout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const decoded = jwt.decode(refreshToken) as JwtPayload;

      if (decoded?._id) {
        await User.findByIdAndUpdate(decoded._id, {
          refreshToken: null,
        });
      }
    }
  } catch {
    // intentionally ignored
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "none",
  });

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "none",
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
};

const deleteAccount = async (req: Request, res: Response) => {
  const { password } = req.body;

  try {
    const user = await User.findById(req.userId).select("+password");
    if (!user) return res.status(400).json({ message: "User doesn't exist" });

    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword)
      return res.status(400).json({ message: "Invalid password" });

    // 1. Delete all related data
    await Classroom.updateMany(
      { students: req.userId },
      { $pull: { students: req.userId } },
    );

    await Attendance.updateMany(
      { students: req.userId },
      { $pull: { students: req.userId } },
    );

    // 2. delete account
    await User.findByIdAndDelete(user._id);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "none",
    });

    res.status(200).json({ message: "Logged out successfully" });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

//@todo validation
const resetPassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.userId).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  // try {
  //   const user = await User.findOne({ email });
  //   if (!user) return res.status(404).json({ message: "User not found" });

  //   // Create a short-lived reset token
  //   const resetToken = jwt.sign(
  //     { id: user._id },
  //     process.env.ACCESS_TOKEN_SECRET!,
  //     { expiresIn: "15m" } // expires in 15 minutes
  //   );

  //   // Create reset link
  //   const resetLink = `http://your-frontend.com/reset-password?token=${resetToken}`;

  //   // Send email (example using nodemailer)
  //   const transporter = nodemailer.createTransport({
  //     host: process.env.SMTP_HOST,
  //     port: parseInt(process.env.SMTP_PORT!),
  //     secure: false,
  //     auth: {
  //       user: process.env.SMTP_USER,
  //       pass: process.env.SMTP_PASS,
  //     },
  //   });

  //   await transporter.sendMail({
  //     from: `"Support" <${process.env.SMTP_USER}>`,
  //     to: user.email,
  //     subject: "Password Reset Request",
  //     html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
  //   });

  //   return res.status(200).json({ message: "Password reset email sent" });
  // } catch (err) {
  //   console.error(err);
  return res.status(500).json({ message: "Server error" });
  // }
};

const refreshAccessToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  console.log("Incoming cookies:", req.cookies);

  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!,
    ) as MyJwtPayload;

    const user = await User.findById(decoded._id);
    if (!user || !user.refreshToken) {
      return res.sendStatus(401);
    }

    const isValid = await bcrypt.compare(token, user.refreshToken);
    if (!isValid) {
      return res.sendStatus(401);
    }

    const newAccessToken = generateAccessToken(user);
    console.log("new access token: ", newAccessToken);
    return res.json({ accessToken: newAccessToken, user });
  } catch {
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};

export {
  googleCallback,
  signup,
  signin,
  loginfailed,
  signout,
  deleteAccount,
  resetPassword,
  forgotPassword,
  refreshAccessToken,
};
