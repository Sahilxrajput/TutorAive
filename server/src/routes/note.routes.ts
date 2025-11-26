import express, { Request, Response } from "express";
import authMiddleware from "../Middlewares/auth.middleware";
import {
  addCollaboratorValidator,
  validateGetNotes,
} from "../validators/note.validator";
import { handleValidation } from "../Middlewares/validate";
import {
  addCollaborator,
  archiveToggler,
  clearTrash,
  saveNote,
  getNoteById,
  getNotesByStatus,
  permanentlyDelete,
  pinToggler,
  removeCollaborator,
  searchQuery,
  trashToggler,
  updateNote,
  changeAccess,
} from "../controllers/note.controller";

const router = express.Router();

// ---------------------- Auth Middleware ----------------------
router.use(authMiddleware);

// ---------------------- Routes ----------------------

// GET all or filtered notes / POST create a new note
//@todo FIX requets body
router.post("/", saveNote);
router.get(
  "/status/:status",
  validateGetNotes,
  handleValidation,
  getNotesByStatus
);

router.route("/:id").get(getNoteById).put(updateNote).delete(permanentlyDelete);

// PATCH routes for toggling note properties
router.patch("/:id/toggle-access", changeAccess);

//@todo authorization
router.patch("/:id/toggle-trash", trashToggler);
router.patch("/:id/toggle-pin", pinToggler);
router.patch("/:id/toggle-archive", archiveToggler);

// DELETE all trashed notes
//@todo maybe notes delete for all, auth
router.delete("/clear-trash", clearTrash);

// Collaborators
//@todo Validate input
router
  .route("/:id/collaborators")
  .post(addCollaboratorValidator, handleValidation, addCollaborator)
  .delete(removeCollaborator);

// Search route (query string-based search)
router.get("/search/query", searchQuery);

export default router;
