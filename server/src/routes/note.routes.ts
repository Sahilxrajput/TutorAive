import express from "express";
import authMiddleware from "../Middlewares/authMiddleware";
import Note from "../models/note.model";
import { ICollaborator, INote, IUser } from "../types/type";
import { Types } from "mongoose";

const router = express.Router();

// ---------------------- auth authMiddleware---------------
router.use(authMiddleware);

// -------------------- Create a Note --------------------
//TODO FIX requets body
router.post("/", async (req, res) => {
  try {
    const note = await Note.create({ ...req.body, owner: req.userId });
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: "Failed to create note", error });
  }
});

// -------------------- Get All Notes (Owned + Collaborator) --------------------
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({
      $or: [{ owner: req.userId }, { "collaborators.user": req.userId }],
      status: { $ne: "trashed" },
    }).sort({ updatedAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notes", error });
  }
});

// -------------------- Get Single Note --------------------
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (
      note.owner.toString() !== req.userId &&
      !note.collaborators.some(
        (c: ICollaborator) => c.user.toString() === req.userId
      )
    ) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch note", error });
  }
});

// -------------------- Update Note --------------------
router.put("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const canEdit =
      note.owner.toString() === req.userId ||
      note.collaborators.some(
        (c: ICollaborator) =>
          c.user.toString() === req.userId && c.access === "edit"
      );

    if (!canEdit)
      return res.status(403).json({ message: "You do not have edit access" });

    //TODO have a look
    Object.assign(note, req.body);
    await note.save();
    res.json(note);
  } catch (error) {
    res.status(400).json({ message: "Failed to update note", error });
  }
});

// -------------------- Delete Note (Soft Delete → Trash) --------------------
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.owner.toString() !== req.userId)
      return res.status(403).json({ message: "Access denied" });

    note.status = "trashed";
    // can remove mongo pre plugin already set
    note.trashedAt = new Date();
    await note.save();

    res.json({ message: "Note moved to trash", note });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete note", error });
  }
});

// -------------------- Permanently Delete Trashed Note --------------------
router.delete("/:id/permanent", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.owner.toString() !== req.userId)
      return res.status(403).json({ message: "Access denied" });

    await note.deleteOne();
    res.json({ message: "Note permanently deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to permanently delete note", error });
  }
});

// -------------------- Pin / Unpin Note --------------------
router.patch("/:id/pin", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.pinnedAt = note.pinnedAt ? null : new Date();
    await note.save();
    res.json({
      message: note.pinnedAt ? "Note pinned" : "Note unpinned",
      note,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle pin", error });
  }
});

// -------------------- Archive / Unarchive Note --------------------
router.patch("/:id/archive", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.status = note.status === "archived" ? "active" : "archived";
    await note.save();
    res.json({
      message: note.status === "archived" ? "Note archived" : "Note restored",
      note,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to archive/unarchive note", error });
  }
});

// -------------------- Add Collaborator --------------------
router.post("/:id/collaborators", async (req, res) => {
  try {
    const { userId, access } = req.body;
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.owner.toString() !== req.userId)
      return res
        .status(403)
        .json({ message: "Only owner can add collaborators" });

    //TODO have  a look
    note.collaborators.push({ user: userId, access });
    await note.save();

    res.json({ message: "Collaborator added", note });
  } catch (error) {
    res.status(400).json({ message: "Failed to add collaborator", error });
  }
});

// -------------------- Remove Collaborator --------------------
router.delete("/:id/collaborators/:collabId", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.owner.toString() !== req.userId)
      return res
        .status(403)
        .json({ message: "Only owner can remove collaborators" });

    note.collaborators = note.collaborators.filter(
      (c: IUser) => c._id != req.params.collabId
    );
    await note.save();

    res.json({ message: "Collaborator removed", note });
  } catch (error) {
    res.status(400).json({ message: "Failed to remove collaborator", error });
  }
});

// -------------------- Search Notes --------------------
router.get("/search/query", async (req, res) => {
  try {
    const { q } = req.query;
    const notes = await Note.find({
      $text: { $search: q as string },
      $or: [{ owner: req.userId }, { "collaborators.user": req.userId }],
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Failed to search notes", error });
  }
});

export default router;
