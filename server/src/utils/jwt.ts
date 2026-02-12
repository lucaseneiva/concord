import jwt from "jsonwebtoken";
import type { User } from "../types/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export const generateToken = (user: Omit<User, "password_hash">): string => {
  return jwt.sign(
    { 
      userId: user.id.toString(), 
      email: user.email 
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};