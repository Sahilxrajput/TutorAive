import express, { Request, Response } from "express";
import authMiddleware from "../Middlewares/authMiddleware";
import {
  addCollaboratorValidator,
  validateGetNotes,
} from "../validators/note.schema";
import { handleValidation } from "../Middlewares/validate";
import {
  addCollaborator,
  archiveToggler,
  clearTrash,
  createNote,
  getNoteById,
  getNotesByStatus,
  permanentlyDelete,
  pinToggler,
  removeCollaborator,
  searchQuery,
  trashToggler,
  updateNote,
  visibilityToggler,
} from "../controllers/note.controller";

const router = express.Router();

// ---------------------- auth authMiddleware---------------
router.use(authMiddleware);

//TODO FIX requets body
router.post("/", createNote);

router.get("/", validateGetNotes, handleValidation, getNotesByStatus);

router.get("/:id", getNoteById);

router.put("/:id", updateNote);

router.patch("/:id/toggle-visibility", visibilityToggler);

//TODO authorization
router.patch("/:id/toggle-trash", trashToggler);

router.patch("/:id/toggle-pin", pinToggler);

router.patch("/:id/toggle-archive", archiveToggler);

router.delete("/:id", permanentlyDelete);

//TODO maybe notes delete for all, auth
router.delete("/clear-trash", clearTrash);

// TODO Validate input
router.post(
  "/:id/collaborators",
  addCollaboratorValidator,
  handleValidation,
  addCollaborator
);

router.delete("/:id/collaborators", removeCollaborator);

router.get("/search/query", searchQuery);

export default router;
