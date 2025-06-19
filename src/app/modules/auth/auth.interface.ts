import { UserRole } from "@prisma/client";

export interface IJwtPayload {
  userId: string;
  email: string;
  userName: string;
  role: UserRole;
  image?: string;
  iat?: number;
  exp?: number;
}
