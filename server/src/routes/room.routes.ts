import { Router } from "express";
import { roomController } from "../controllers/room.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get("/", (req, res, next) => roomController.list(req, res, next));
router.post("/", (req, res, next) => roomController.create(req, res, next));
router.get("/:roomId/messages", (req, res, next) => roomController.getMessages(req, res, next));
router.post("/:roomId/join", (req, res, next) => roomController.join(req, res, next));

export default router;