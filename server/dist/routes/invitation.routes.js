"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const invitation_controller_1 = require("../controllers/invitation.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const Instructor_middleware_1 = require("../middlewares/Instructor.middleware");
const router = express_1.default.Router();
// Routes
router.use(auth_middleware_1.default);
// @remind !check lecture or classroom or both
router.get("/:code", invitation_controller_1.getInvitationByCode);
router.get("/classroom/:id", invitation_controller_1.getInvitationsByClassroom);
router.post("/:code/use", invitation_controller_1.useInvitation);
// Instructor Only
router.use(Instructor_middleware_1.isInstructor);
router.post("/", invitation_controller_1.createInvitation);
router.delete("/:id", invitation_controller_1.deleteInvitation);
exports.default = router;
