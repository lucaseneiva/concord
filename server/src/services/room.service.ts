import { prisma } from "../config/db.js";
import { NotFoundError } from "../utils/errors.js";

export class RoomService {
  async createRoom(name: string, ownerId: string) {
    // Transaction: Create room AND add creator as first member
    return prisma.$transaction(async (tx) => {
      const room = await tx.room.create({
        data: {
          name,
          is_group: true,
        },
      });

      await tx.roomMember.create({
        data: {
          room_id: room.id,
          user_id: ownerId,
        },
      });

      return room;
    });
  }

  async getAllRooms() {
    // For MVP: List all available rooms
    return prisma.room.findMany({
      orderBy: { created_at: "desc" },
    });
  }

  async getRoomMessages(roomId: string) {
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundError("Room");

    return prisma.message.findMany({
      where: { room_id: roomId },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
      orderBy: { created_at: "asc" },
    });
  }

  async joinRoom(roomId: string, userId: string) {
     const room = await prisma.room.findUnique({ where: { id: roomId } });
     if (!room) throw new NotFoundError("Room");

     // Check if already member to avoid error
     const existingMember = await prisma.roomMember.findUnique({
       where: {
         room_id_user_id: {
           room_id: roomId,
           user_id: userId
         }
       }
     });

     if (existingMember) return existingMember;

     return prisma.roomMember.create({
       data: {
         room_id: roomId,
         user_id: userId
       }
     });
  }
}

export const roomService = new RoomService();