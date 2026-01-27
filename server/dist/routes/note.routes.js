"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const note_validator_1 = require("../validators/note.validator");
const handleValidation_1 = require("../middlewares/handleValidation");
const note_controller_1 = require("../controllers/note.controller");
const router = express_1.default.Router();
// ---------------------- Auth Middleware ----------------------
router.use(auth_middleware_1.default);
// ---------------------- Routes ----------------------
// GET all or filtered notes / POST create a new note
//@todo FIX requets body
router.post("/", note_controller_1.saveNote);
router.get("/status/:status", note_validator_1.validateGetNotes, handleValidation_1.handleValidation, note_controller_1.getNotesByStatus);
router.route("/:id").get(note_controller_1.getNoteById).put(note_controller_1.updateNote).delete(note_controller_1.permanentlyDelete);
// PATCH routes for toggling note properties
router.patch("/:id/toggle-access", note_controller_1.changeAccess);
//@todo authorization
router.patch("/:id/toggle-trash", note_controller_1.trashToggler);
router.patch("/:id/toggle-pin", note_controller_1.pinToggler);
router.patch("/:id/toggle-archive", note_controller_1.archiveToggler);
// DELETE all trashed notes
//@todo maybe notes delete for all, auth
router.delete("/clear-trash", note_controller_1.clearTrash);
// Collaborators
//@todo Validate input
router
    .route("/:id/collaborators")
    .post(note_validator_1.addCollaboratorValidator, handleValidation_1.handleValidation, note_controller_1.addCollaborator)
    .delete(note_controller_1.removeCollaborator);
// Search route (query string-based search)
router.get("/search/query", note_controller_1.searchQuery);
exports.default = router;
