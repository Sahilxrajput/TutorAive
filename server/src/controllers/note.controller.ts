import { Request, Response } from "express";
import Note from "../models/note.model";
import { ICollaborator, INote, IUser } from "../types/type";
import User from "../models/user.model";

export const createNote = async (req: Request, res: Response) => {
  try {
    const note = await Note.create({ ...req.body, owner: req.userId });
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: "Failed to create note", error });
  }
};

export const getNotesByStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;
    const { status } = req.query;

    const filter = {
      $or: [{ owner: userId }, { "collaborators.user": userId }],
      status: status ?? "active",
    };

    const notes = await Note.find(filter).sort({ updatedAt: -1 });

    res.status(200).json(notes);
  } catch (error: any) {
    console.error("Error fetching notes:", error);
    res.status(500).json({
      message: "Failed to fetch notes",
      error: error.message || "Unknown error",
    });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (
      note.owner.toString() !== req.userId &&
      !note.collaborators.some(
        (c: ICollaborator) => c.user.toString() === req.userId
      ) &&
      note.visibility === "private"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch note", error });
  }
};

export const updateNote = async (req: Request, res: Response) => {
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

    //@todo have a look
    Object.assign(note, req.body);
    await note.save();
    res.json(note);
  } catch (error) {
    res.status(400).json({ message: "Failed to update note", error });
  }
};

export const visibilityToggler = async (req: Request, res: Response) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    // Only owner can change visibility
    if (note.owner.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You are not allowed to change visibility" });
    }

    const newVisibility = note.visibility === "private" ? "public" : "private";
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { visibility: newVisibility },
      { new: true }
    );

    res.json({ message: `Note made ${newVisibility}`, updatedNote });
  } catch (error) {
    res.status(400).json({ message: "Failed to update visibility", error });
  }
};

export const trashToggler = async (req: Request, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    // if (note.owner.toString() !== req.userId)
    //   return res.status(403).json({ message: "Access denied" });

    // Toggle between 'trashed' and 'active'
    note.status = note.status === "trashed" ? "active" : "trashed";
    await note.save();

    const actionMessage =
      note.status === "trashed"
        ? "Note moved to trash successfully"
        : "Note restored successfully";

    res.json({
      message: actionMessage,
      note,
    });

    res.json({ message: "Note moved to trash", note });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete note", error });
  }
};

export const pinToggler = async (req: Request, res: Response) => {
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
};

export const archiveToggler = async (req: Request, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.status = note.status === "archived" ? "active" : "archived";
    await note.save();
    res.json({
      message: note.status === "archived" ? "Note archived" : "Note unarchive",
      note,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to archive/unarchive note", error });
  }
};

export const permanentlyDelete = async (req: Request, res: Response) => {
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
};

export const clearTrash = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;

    // Find all trashed notes where user is owner or collaborator
    const trashedNotes = await Note.find({
      status: "trashed",
      $or: [{ owner: userId }, { "collaborators.user": userId }],
    });

    if (!trashedNotes.length) {
      return res
        .status(404)
        .json({ message: "No trashed notes found to clear" });
    }

    let deletedCount = 0;
    let updatedCount = 0;

    for (const note of trashedNotes) {
      if (note.owner.toString() === userId.toString()) {
        // User is the owner → delete the note
        await Note.deleteOne({ _id: note._id });
        deletedCount++;
      } else {
        // User is a collaborator → remove them from collaborators array
        note.collaborators = note.collaborators.filter(
          (c: ICollaborator) => c.user.toString() !== userId.toString()
        );
        await note.save();
        updatedCount++;
      }
    }

    res.status(200).json({
      message: `Trash cleared successfully`,
      deletedNotes: deletedCount,
      updatedNotes: updatedCount,
    });
  } catch (error) {
    console.error("Error clearing trash:", error);
    res.status(500).json({ message: "Failed to clear trashed notes" });
  }
};

export const addCollaborator = async (req: Request, res: Response) => {
  try {
    const { userEmail, access } = req.body;
    const noteId = req.params.id;

    // Fetch the note
    const note = await Note.findById<INote>(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    // Fetch the user
    const user = await User.findOne<IUser>({ email: userEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Only the owner can add collaborators
    if (note.owner.toString() !== req.userId)
      return res
        .status(403)
        .json({ message: "Only owner can add collaborators" });

    // Check if user already exists as collaborator
    const alreadyExists = note.collaborators.some(
      (c) => c.user.toString() === user._id.toString()
    );

    if (alreadyExists)
      return res
        .status(400)
        .json({ message: "User is already a collaborator" });

    // Add collaborator
    note.collaborators.push({ user: user._id, access });
    await note.save();

    res.json({ message: `Collaborator ${userEmail} added`, note });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to add collaborator", error });
  }
};

export const removeCollaborator = async (req: Request, res: Response) => {
  try {
    const { userEmail } = req.query;
    const noteId = req.params.id;

    if (!userEmail)
      return res.status(400).json({ message: "Missing userEmail query param" });

    // Fetch note and user properly
    const note = await Note.findById<INote>(noteId).lean();
    const userToRemove = await User.findOne({ email: userEmail });

    if (!note) return res.status(404).json({ message: "Note not found" });
    if (!userToRemove)
      return res.status(404).json({ message: "User not found" });

    // Ensure only the owner can remove collaborators
    if (note.owner.toString() !== req.userId)
      return res
        .status(403)
        .json({ message: "Only owner can remove collaborators" });

    // Remove collaborator by comparing stringified ObjectIds
    const newCollaborators = note.collaborators.filter(
      (c: ICollaborator) => c.user.toString() !== userToRemove._id.toString()
    );

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { collaborators: newCollaborators },
      { new: true }
    ).orFail();

    res.json({ message: `${userEmail}, Collaborator removed`, updatedNote });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to remove collaborator", error });
  }
};

export const searchQuery = async (req: Request, res: Response) => {
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
};
