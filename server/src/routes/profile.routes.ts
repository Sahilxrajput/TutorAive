import { Router } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import authMiddleware from "../Middlewares/authMiddleware";

const profileRouter = Router();
 
// profile
profileRouter.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// get a user by id
profileRouter.get("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

export default profileRouter;
