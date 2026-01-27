"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInstructor = void 0;
const isInstructor = (req, res, next) => {
    try {
        if (req.userRole !== "instructor") {
            return res
                .status(403)
                .json({ message: "Access denied. Instructors only." });
        }
        next();
    }
    catch (error) {
        console.error("isInstructor middleware error:", error);
        return res
            .status(500)
            .json({ message: "Server error verifying instructor role." });
    }
};
exports.isInstructor = isInstructor;
