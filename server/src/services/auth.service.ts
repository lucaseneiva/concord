import { prisma } from "../config/db.js";
import { generateToken } from "../utils/jwt.js";
import { hashPassword, comparePassword } from "../utils/password.js";

export class AuthService {
  async register(data: any) {
    const { username, email, password } = data;

    // Verificar se usuário já existe (Opcional, mas recomendado antes do create)
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const password_hash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password_hash,
      },
    });

    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
    };

    const token = generateToken(userResponse);

    return { user: userResponse, token };
  }

  async login(data: any) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
    };

    const token = generateToken(userResponse);

    return { user: userResponse, token };
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Exclude password_hash
    const { password_hash, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}

export const authService = new AuthService();