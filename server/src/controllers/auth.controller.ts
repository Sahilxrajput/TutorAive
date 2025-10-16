import Attendance from "../models/attendence.model.";
import Classroom from "../models/classroom.model";
import User from "../models/user.model";
import generateAuthToken from "../utils/generateAuthToken";
import bcrypt from "bcrypt";

const signup = async (req: any, res: any) => {
  try {
    const { email, firstName, lastName, userName, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // TODO in validation set default value of lastname and user
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

    // Exclude password from response
    const { password: _, ...userData } = savedUser.toObject();

    const token = generateAuthToken(savedUser);

    // Set token in HTTP-only cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({ user: userData, token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Failed to create user", err });
  }
};

const login = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    // Fetch user and include password explicitly
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = generateAuthToken(user);

    // Set token as HTTP-only cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Remove sensitive data before sending response
    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      message: "Login successful",
      user: userData,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

const loginfailed = (req: any, res: any) => {
  return res.status(401).json({ success: false, message: "Login failed" });
};

const logout = (req: any, res: any) => {
  req.session.destroy((err: Error) => {
    if (err) {
      console.error("Session destruction error:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.status(200).json({ message: "Logged out successfully" });
  });
};

const deleteAccount = async (req: any, res: any) => {
  const { password } = req.body;

  try {
    const user = await User.findById(req.userId).select("+password");
    if (!user) return res.status(400).json({ message: "User doesn't exist" });

    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword)
      return res.status(400).json({ message: "Invalid password" });

    // 1. Delete all related data
    await Classroom.updateMany(
      { students: req.userdId },
      { $pull: { students: req.userId } }
    );

    await Attendance.updateMany(
      { students: req.userdId },
      { $pull: { students: req.userId } }
    );

    // 2. delete account
    await User.findByIdAndDelete(user._id);

    req.session.destroy((err: Error) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.status(200).json({ message: "Logged out successfully" });
    });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

//TODO validation
const resetPassword = async (req: any, res: any) => {
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

const forgotPassword = async (req: any, res: any) => {
  const { email } = req.body;

  // try {
  //   const user = await User.findOne({ email });
  //   if (!user) return res.status(404).json({ message: "User not found" });

  //   // Create a short-lived reset token
  //   const resetToken = jwt.sign(
  //     { id: user._id },
  //     process.env.JWT_SECRET!,
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

export {
  signup,
  login,
  loginfailed,
  logout,
  deleteAccount,
  resetPassword,
  forgotPassword,
};
