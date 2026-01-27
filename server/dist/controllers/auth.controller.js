"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.forgotPassword = exports.resetPassword = exports.deleteAccount = exports.signout = exports.loginfailed = exports.signin = exports.signup = exports.googleCallback = void 0;
const attendence_model_1 = __importDefault(require("../models/attendence.model."));
const classroom_model_1 = require("../models/classroom.model");
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateAuthToken_1 = require("../utils/generateAuthToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const googleCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const refreshToken = (0, generateAuthToken_1.generateRefreshToken)({
        _id: user._id.toString(),
        userName: user.userName,
        role: user.role,
    });
    // store hashed refresh token
    user.refreshToken = yield bcrypt_1.default.hash(refreshToken, 12);
    yield user.save();
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // redirect with no tokens in URL
    res.redirect(`${process.env.CLIENT_URL}/auth/success`);
});
exports.googleCallback = googleCallback;
//@todo add firstname, lastname default
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, firstName = "tony", lastName = "strak", userName, password, role, } = req.body;
        // Check if user already exists
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 12);
        // @todo in validation set default value of lastname and user
        const newUser = new user_model_1.default({
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
        const savedUser = yield newUser.save();
        const accessToken = (0, generateAuthToken_1.generateAccessToken)(savedUser);
        const refreshToken = (0, generateAuthToken_1.generateRefreshToken)(savedUser);
        // save hashed refresh token
        savedUser.refreshToken = yield bcrypt_1.default.hash(refreshToken, 12);
        yield savedUser.save();
        // Exclude password from response
        const _a = savedUser.toObject(), { password: _, refreshToken: __ } = _a, userData = __rest(_a, ["password", "refreshToken"]);
        // Set token in HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(201).json({ user: userData, accessToken });
    }
    catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Failed to create user", err });
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_model_1.default.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // 1️. Generate tokens
        const accessToken = (0, generateAuthToken_1.generateAccessToken)(user);
        const refreshToken = (0, generateAuthToken_1.generateRefreshToken)(user);
        // 2️. Store hash refresh token in DB
        user.refreshToken = yield bcrypt_1.default.hash(refreshToken, 12);
        yield user.save();
        // 3️. Send refresh token as httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        // 4️. Remove sensitive fields
        const _a = user.toObject(), { password: _, refreshToken: __ } = _a, userData = __rest(_a, ["password", "refreshToken"]);
        // 5️. Send access token in response body
        return res.status(200).json({
            message: "Login successful",
            user: userData,
            accessToken,
        });
    }
    catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.signin = signin;
const loginfailed = (req, res) => {
    return res.status(401).json({ success: false, message: "Login failed" });
};
exports.loginfailed = loginfailed;
const signout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            yield user_model_1.default.findByIdAndUpdate(decoded._id, {
                refreshToken: null,
            });
        }
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        return res.status(200).json({ message: "Logged out successfully" });
    }
    catch (err) {
        // Even if token is invalid/expired, logout should succeed
        res.clearCookie("refreshToken");
        return res.status(200).json({ message: "Logged out successfully" });
    }
});
exports.signout = signout;
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    try {
        const user = yield user_model_1.default.findById(req.userId).select("+password");
        if (!user)
            return res.status(400).json({ message: "User doesn't exist" });
        const correctPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!correctPassword)
            return res.status(400).json({ message: "Invalid password" });
        // 1. Delete all related data
        yield classroom_model_1.Classroom.updateMany({ students: req.userId }, { $pull: { students: req.userId } });
        yield attendence_model_1.default.updateMany({ students: req.userId }, { $pull: { students: req.userId } });
        // 2. delete account
        yield user_model_1.default.findByIdAndDelete(user._id);
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({ message: "Logged out successfully" });
        return res.status(200).json({ message: "User deleted successfully" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.deleteAccount = deleteAccount;
//@todo validation
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = yield user_model_1.default.findById(req.userId).select("+password");
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const isMatch = yield bcrypt_1.default.compare(currentPassword, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Current password is incorrect" });
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 12);
        user.password = hashedPassword;
        yield user.save();
        return res.status(200).json({ message: "Password reset successfully" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.resetPassword = resetPassword;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.forgotPassword = forgotPassword;
const refreshAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({ message: "No refresh token" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = yield user_model_1.default.findById(decoded._id);
        if (!user || !user.refreshToken)
            return res.sendStatus(403);
        const isValid = yield bcrypt_1.default.compare(token, user.refreshToken);
        if (!isValid)
            return res.sendStatus(403);
        const newAccessToken = (0, generateAuthToken_1.generateAccessToken)(user);
        return res.json({ accessToken: newAccessToken });
    }
    catch (_a) {
        return res.status(403).json({ message: "Refresh token expired" });
    }
});
exports.refreshAccessToken = refreshAccessToken;
