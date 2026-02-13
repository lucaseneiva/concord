import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validation.js";
import { registerSchema, loginSchema } from "../../schemas/auth.schema.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  (req, res) => authController.register(req, res)
);

router.post(
  "/login",
  validateRequest(loginSchema),
  (req, res) => authController.login(req, res)
);

router.get(
  "/me",
  authenticate,
  (req, res) => authController.getMe(req, res)
);

export default router;