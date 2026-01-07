import { Request, Response } from "express";
import Attendance from "../models/attendence.model.";
import Classroom from "../models/classroom.model";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateAuthToken";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser, MyJwtPayload } from "../types/type";
import { HydratedDocument } from "mongoose";

const googleCallback = async (req: Request, res: Response) => {
  const user = req.user as HydratedDocument<IUser>;

  const refreshToken = generateRefreshToken({
    _id: user._id.toString(),
    userName: user.userName!,
    role: user.role,
  });

  // store hashed refresh token
  user.refreshToken = await bcrypt.hash(refreshToken, 12);
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // redirect with no tokens in URL
  res.redirect(`${process.env.CLIENT_URL}/auth/success`);
};

//@todo add firstname, lastname default
const signup = async (req: Request, res: Response) => {
  try {
    let {
      email,
      firstName = "tony",
      lastName = "strak",
      userName,
      password,
      role,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // @todo in validation set default value of lastname and user
    const newUser = new User({
      email,
      userName,
      firstName,
      lastName,
      role,
      password: hashedPassword,
    });
    // ensures your plain email/password users don’t insert { oauthId: null } into the DB.
    // if (!oauthProvider) delete newUser.oauthProvider;
    // if (!oauthId) delete newUser.oauthId;

    const savedUser = await newUser.save();

    const accessToken = generateAccessToken(savedUser);
    const refreshToken = generateRefreshToken(savedUser);

    // save hashed refresh token
    savedUser.refreshToken = await bcrypt.hash(refreshToken, 12);
    await savedUser.save();

    // Exclude password from response
    const { password: _, refreshToken: __, ...userData } = savedUser.toObject();

    // Set token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({ user: userData, accessToken });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Failed to create user", err });
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
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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

const loginfailed = (req: Request, res: Response) => {
  return res.status(401).json({ success: false, message: "Login failed" });
};

const signout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as JwtPayload;

      await User.findByIdAndUpdate(decoded._id, {
        refreshToken: null,
      });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    // Even if token is invalid/expired, logout should succeed
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logged out successfully" });
  }
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
      { $pull: { students: req.userId } }
    );

    await Attendance.updateMany(
      { students: req.userId },
      { $pull: { students: req.userId } }
    );

    // 2. delete account
    await User.findByIdAndDelete(user._id);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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

  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!
    ) as MyJwtPayload;

    const user = await User.findById(decoded._id);

    if (!user || !user.refreshToken) return res.sendStatus(403);

    const isValid = await bcrypt.compare(token, user.refreshToken);
    if (!isValid) return res.sendStatus(403);

    const newAccessToken = generateAccessToken(user);

    return res.json({ accessToken: newAccessToken });
  } catch {
    return res.status(403).json({ message: "Refresh token expired" });
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
