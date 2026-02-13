import type { Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import type { AuthRequest } from "../middleware/auth.js";

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.register(req.body);
      
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error("Registration error:", error);
    
      if (error.message === "User already exists") {
        res.status(409).json({ success: false, error: error.message });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.message === "Invalid credentials") {
        res.status(401).json({ success: false, error: "Invalid email or password" });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  async getMe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || "";
      const user = await authService.getUserById(userId);

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error: any) {
      console.error("Get user error:", error);

      if (error.message === "User not found") {
        res.status(404).json({ success: false, error: "User not found" });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
}

export const authController = new AuthController();