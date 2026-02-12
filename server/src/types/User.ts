export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

export interface UserCreateInput {
  username: string;
  email: string;
  password: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: Omit<User, "password_hash">;
    token: string;
  };
  error?: string;
}