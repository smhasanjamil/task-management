import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../lib/prisma";

// const prisma = new PrismaClient();

// Create user
const createUserIntoDB = async (payload: Partial<User>) => {
  const { userId, userName, email, password, role, image } = payload;

  if (!userId || !userName || !email || !password || !role) {
    throw new Error("Missing required user fields");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await prisma.user.create({
    data: {
      userId,
      userName,
      email,
      password: hashedPassword,
      role,
      image,
    },
    select: {
      id: true,
      userId: true,
      userName: true,
      email: true,
      role: true,
      image: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

// Get all user
const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany();
  return result;
};

// Get single user from db
const getSingleUserFromDB = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
  });

  if (!result) {
    throw new Error("User not found");
  }

  return result;
};

// Update User
const updateUserInDB = async (id: string, payload: Partial<User>) => {
  const isExist = await prisma.user.findUnique({ where: { id } });

  if (!isExist) {
    throw new Error("User not found");
  }

  //if trying to deactivate user, handle soft delete
  if (payload.isActive === false && isExist.isActive === true) {
    //using transaction to ensure all operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      //1. remove user from all team assignments
      await tx.userAssignedTeam.deleteMany({
        where: { userId: isExist.userId }
      });
      //2. remove user from all project assignments
      await tx.userAssignedProject.deleteMany({
        where: { userId: isExist.userId }
      });
      //3. remove user from all UI project members
      await tx.projectUIMember.deleteMany({
        where: { userId: isExist.userId }
      });
      //4. remove user from all frontend project members
      await tx.projectFrontendMember.deleteMany({
        where: { userId: isExist.userId }
      });
      //5. remove user from all backend project members
      await tx.projectBackendMember.deleteMany({
        where: { userId: isExist.userId }
      });
      //6. remove user from all chat room participants
      await tx.chatRoomParticipant.deleteMany({
        where: { userId: isExist.id }
      });

      //Set user's isActive to false
      const updateUser = await tx.user.update({
        where: { id },
        data: { isActive: false },
        select: {
          id: true,
          userId: true,
          userName: true,
          email: true,
          role: true,
          image: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      });
      return updateUser;
    })

    return result;
  }

  if (payload.password) {
    // If password is being updated, hash it
    payload.password = await bcrypt.hash(payload.password, 12);
  }

  const result = await prisma.user.update({
    where: { id },
    data: payload,
  });

  return result;
};

export const userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserInDB,
};
