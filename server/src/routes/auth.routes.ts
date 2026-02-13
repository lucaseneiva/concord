import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { registerSchema, loginSchema } from "../../schemas/auth.schema.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  (req, res, next) => authController.register(req, res, next)
);

router.post(
  "/login",
  validateRequest(loginSchema),
  (req, res, next) => authController.login(req, res, next)
);

router.get(
  "/me",
  authenticate,
  (req, res, next) => authController.getMe(req, res, next)
);

export default router;