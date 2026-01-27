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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchQuery = exports.removeCollaborator = exports.addCollaborator = exports.clearTrash = exports.permanentlyDelete = exports.archiveToggler = exports.pinToggler = exports.trashToggler = exports.changeAccess = exports.updateNote = exports.getNoteById = exports.getNotesByStatus = exports.saveNote = void 0;
const note_model_1 = __importDefault(require("../models/note.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const saveNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("body", req.body);
        const { content, title, classroom } = req.body;
        console.log("content", content);
        console.log("title", title);
        if (!content || !title)
            return res.status(400).json({ error: "Content and title are required." });
        const note = yield note_model_1.default.create({
            content,
            title,
            owner: req.userId,
            classroom: classroom || null,
        });
        console.log(note);
        res.status(201).json({ data: note, message: "Note saved successfully." });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "Failed to save note", error });
    }
});
exports.saveNote = saveNote;
const getNotesByStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { status } = req.params;
        let filter = {};
        if (status === "pinned") {
            // Notes pinned by the current user
            filter = { pinnedBy: userId };
        }
        else if (status === "other") {
            filter = {
                status: "active",
                isPublic: true,
                owner: { $ne: userId },
                "collaborators.user": { $ne: userId },
            };
        }
        else {
            filter = {
                status: status !== null && status !== void 0 ? status : "active",
                $or: [
                    { owner: userId },
                    { "collaborators.user": userId },
                    { isPublic: true },
                ],
            };
        }
        const notes = yield note_model_1.default.find(filter)
            .populate("owner", "email profilePicture userName firstName lastName")
            .populate("collaborators.user", "profilePicture userName firstName lastName")
            .sort({ updatedAt: -1 });
        res.status(200).json({ data: notes, success: true });
    }
    catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({
            message: "Failed to fetch notes",
            error: error.message || "Unknown error",
        });
    }
});
exports.getNotesByStatus = getNotesByStatus;
const getNoteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const noteId = req.params.id;
        const note = yield note_model_1.default.findById(noteId);
        if (!note)
            return res.status(404).json({ message: "Note not found" });
        const isOwner = note.owner.toString() === req.userId;
        const isCollaborator = note.collaborators.some((c) => c.user.toString() === req.userId);
        const isPublic = note.isPublic;
        if (!isOwner && !isCollaborator && !isPublic) {
            return res.status(403).json({ message: "Access denied" });
        }
        return res
            .status(200)
            .json({ data: note, message: "Fetched note successfully" });
    }
    catch (error) {
        console.error("Error fetching note:", error);
        return res.status(500).json({ message: "Failed to fetch note", error });
    }
});
exports.getNoteById = getNoteById;
const updateNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield note_model_1.default.findById(req.params.id);
        if (!note)
            return res.status(404).json({ message: "Note not found" });
        const canEdit = note.owner.toString() === req.userId ||
            note.collaborators.some((c) => c.user.toString() === req.userId && c.access === "edit");
        if (!canEdit)
            return res.status(403).json({ message: "You do not have edit access" });
        //@todo have a look
        Object.assign(note, req.body);
        yield note.save();
        res.json({ message: "note updated succesfully", data: note });
    }
    catch (error) {
        res.status(400).json({ message: "Failed to update note", error });
    }
});
exports.updateNote = updateNote;
const changeAccess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const noteId = req.params.id;
        const note = yield note_model_1.default.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        // only owner can update access
        if (note.owner.toString() !== req.userId) {
            return res.status(403).json({
                message: "You are not allowed to change access",
            });
        }
        // toggle
        note.isPublic = !note.isPublic;
        const msg = note.isPublic ? "Note made public" : "Note made private";
        yield note.save();
        res.json({
            message: msg,
            data: note,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Failed to update access",
            error,
        });
    }
});
exports.changeAccess = changeAccess;
const trashToggler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield note_model_1.default.findById(req.params.id);
        if (!note)
            return res.status(404).json({ message: "Note not found" });
        // if (note.owner.toString() !== req.userId)
        //   return res.status(403).json({ message: "Access denied" });
        // Toggle between 'trashed' and 'active'
        note.status = note.status === "trashed" ? "active" : "trashed";
        yield note.save();
        const actionMessage = note.status === "trashed"
            ? "Note moved to trash successfully"
            : "Note restored successfully";
        res.json({
            message: actionMessage,
            data: note,
        });
        res.json({ message: "Note moved to trash", data: note });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete note", error });
    }
});
exports.trashToggler = trashToggler;
const pinToggler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const note = yield note_model_1.default.findById(req.params.id);
        if (!note)
            return res.status(404).json({ message: "Note not found" });
        const alreadyPinned = note.pinnedBy.some((u) => u.toString() === userId);
        if (alreadyPinned) {
            // Unpin
            note.pinnedBy = note.pinnedBy.filter((u) => u.toString() !== userId);
        }
        else {
            // Pin
            note.pinnedBy.push(userId);
        }
        const updatedNote = yield note.save();
        res.status(200).json({
            success: true,
            data: updatedNote,
            message: alreadyPinned ? "Note Unpinned" : "Note Pinned",
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to toggle pin" });
    }
});
exports.pinToggler = pinToggler;
const archiveToggler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield note_model_1.default.findById(req.params.id);
        if (!note)
            return res.status(404).json({ message: "Note not found" });
        note.status = note.status === "archived" ? "active" : "archived";
        yield note.save();
        res.json({
            message: note.status === "archived" ? "Note archived" : "Note unarchive",
            data: note,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to archive/unarchive note", error });
    }
});
exports.archiveToggler = archiveToggler;
const permanentlyDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield note_model_1.default.findById(req.params.id);
        if (!note)
            return res.status(404).json({ message: "Note not found" });
        if (note.owner.toString() !== req.userId)
            return res.status(403).json({ message: "Access denied" });
        yield note.deleteOne();
        res.json({ message: "Note permanently deleted" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to permanently delete note", error });
    }
});
exports.permanentlyDelete = permanentlyDelete;
const clearTrash = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        // Find all trashed notes where user is owner or collaborator
        const trashedNotes = yield note_model_1.default.find({
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
                yield note_model_1.default.deleteOne({ _id: note._id });
                deletedCount++;
            }
            else {
                // User is a collaborator → remove them from collaborators array
                note.collaborators = note.collaborators.filter((c) => c.user.toString() !== userId.toString());
                yield note.save();
                updatedCount++;
            }
        }
        // @remind
        res.status(200).json({
            message: `Trash cleared successfully`,
            deletedNotes: deletedCount,
            updatedNotes: updatedCount,
        });
    }
    catch (error) {
        console.error("Error clearing trash:", error);
        res.status(500).json({ message: "Failed to clear trashed notes" });
    }
});
exports.clearTrash = clearTrash;
const addCollaborator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userEmail, access } = req.body;
        const noteId = req.params.id;
        // Fetch the note
        const note = yield note_model_1.default.findById(noteId);
        if (!note)
            return res.status(404).json({ message: "Note not found" });
        // Fetch the user
        const user = yield user_model_1.default.findOne({ email: userEmail });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        // Only the owner can add collaborators
        if (note.owner.toString() !== req.userId)
            return res
                .status(403)
                .json({ message: "Only owner can add collaborators" });
        // Check if user already exists as collaborator
        const alreadyExists = note.collaborators.some((c) => c.user._id.toString() === user._id.toString());
        if (alreadyExists)
            return res
                .status(400)
                .json({ message: "User is already a collaborator" });
        // Add collaborator
        note.collaborators.push({ user: user._id, access });
        yield note.save();
        res.json({ message: `Collaborator ${userEmail} added`, data: note });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: "Failed to add collaborator", error });
    }
});
exports.addCollaborator = addCollaborator;
const removeCollaborator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userEmail } = req.query;
        const noteId = req.params.id;
        if (!userEmail)
            return res.status(400).json({ message: "Missing userEmail query param" });
        // Fetch note and user properly
        const note = yield note_model_1.default.findById(noteId).lean();
        const userToRemove = yield user_model_1.default.findOne({ email: userEmail });
        if (!note)
            return res.status(404).json({ message: "Note not found" });
        if (!userToRemove)
            return res.status(404).json({ message: "User not found" });
        // Ensure only the owner can remove collaborators
        if (note.owner.toString() !== req.userId)
            return res
                .status(403)
                .json({ message: "Only owner can remove collaborators" });
        // Remove collaborator by comparing stringified ObjectIds
        const newCollaborators = note.collaborators.filter((c) => c.user.toString() !== userToRemove._id.toString());
        const updatedNote = yield note_model_1.default.findByIdAndUpdate(noteId, { collaborators: newCollaborators }, { new: true }).orFail();
        res.json({
            message: `${userEmail}, Collaborator removed`,
            data: updatedNote,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: "Failed to remove collaborator", error });
    }
});
exports.removeCollaborator = removeCollaborator;
const searchQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { q } = req.query;
        const notes = yield note_model_1.default.find({
            $text: { $search: q },
            $or: [{ owner: req.userId }, { "collaborators.user": req.userId }],
        });
        res.json(notes);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to search notes", error });
    }
});
exports.searchQuery = searchQuery;
