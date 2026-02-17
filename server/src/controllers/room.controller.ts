import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { roomService } from "../services/room.service.js";

export class RoomController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      const userId = req.user!.userId;
      const room = await roomService.createRoom(name, userId);
      res.status(201).json({ success: true, data: room });
    } catch (error) {
      next(error);
    }
  }

  async list(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const rooms = await roomService.getAllRooms();
      res.status(200).json({ success: true, data: rooms });
    } catch (error) {
      next(error);
    }
  }

  async getMessages(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.params;
      const messages = await roomService.getRoomMessages(roomId as string);
      res.status(200).json({ success: true, data: messages });
    } catch (error) {
      next(error);
    }
  }

  async join(req: AuthRequest, res: Response, next: NextFunction) {
      try {
          const { roomId } = req.params;
          const userId = req.user!.userId;
          await roomService.joinRoom(roomId as string, userId);
          res.status(200).json({ success: true, message: "Joined room" });
      } catch (error) {
          next(error);
      }
  }
}

export const roomController = new RoomController();