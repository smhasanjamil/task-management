// import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { JwtUtils } from "./auth.utils";
import config from "../../../config";
import prisma from "../../../lib/prisma";

// const prisma = new PrismaClient();

const loginUser = async (userId: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { userId  } });
  if (!user) {
    throw new Error("Invalid email or password");
  }
  

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const payload = {
    userId: user.id,
    email: user.email,
    userName: user.userName,
    role: user.role,
  };

  const token = JwtUtils.createToken(
    payload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as "7d"
  );

  return {
    user: {
      id: user.id,
      userId: user.userId,
      userName: user.userName,
      email: user.email,
      role: user.role,
      image: user.image,
    },
    token,
  };
};

export const authService = {
  loginUser,
};
