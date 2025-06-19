import { Message, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createRoomInDB = async (payload: {
  name?: string;
  projectId?: string;
  teamId?: string;
}) => {
  return await prisma.chatRoom.create({
    data: {
      name: payload.name,
      project: payload.projectId
        ? { connect: { id: payload.projectId } }
        : undefined,
      team: payload.teamId ? { connect: { id: payload.teamId } } : undefined,
    },
    include: {
      project: true,
      team: true,
    },
  });
};

const saveMessageToDB = async (
  payload: Prisma.MessageCreateInput
): Promise<Message> => {
  const result = await prisma.message.create({
    data: payload,
    include: {
      sender: true,
      room: true,
    },
  });
  return result;
};

const getMessagesFromDB = async (roomId: string) => {
  const result = await prisma.message.findMany({
    where: { roomId },
    include: {
      sender: true,
      room: true,
    },
    orderBy: { createdAt: "asc" },
  });
  return result;
};

const getRoomsFromDB = async () => {
  return await prisma.chatRoom.findMany({
    include: { project: true, team: true },
  });
};

// Add Participant To Room
const addParticipantToRoom = async (roomId: string, userId: string) => {
  return await prisma.chatRoomParticipant.create({
    data: {
      user: { connect: { id: userId } },
      chatRoom: { connect: { id: roomId } },
    },
    include: {
      user: true,
      chatRoom: true,
    },
  });
};

// Remove Participant From Room
const removeParticipantFromRoom = async (roomId: string, userId: string) => {
  // 1. Verify participant exists
  const participant = await prisma.chatRoomParticipant.findUniqueOrThrow({
    where: {
      userId_chatRoomId: {
        userId,
        chatRoomId: roomId,
      },
    },
    include: { user: true },
  });

  // 2. Perform deletion
  await prisma.chatRoomParticipant.delete({
    where: {
      userId_chatRoomId: {
        userId,
        chatRoomId: roomId,
      },
    },
  });

  // 3. Return formatted data
  return {
    id: participant.id,
    userId: participant.userId,
    chatRoomId: participant.chatRoomId,
    user: {
      id: participant.user.id,
      name: participant.user.userName,
      email: participant.user.email,
    },
    removedAt: new Date(),
  };
};

// Get Room Participants
const getRoomParticipants = async (roomId: string) => {
  return await prisma.chatRoomParticipant.findMany({
    where: { chatRoomId: roomId },
    include: { user: true },
  });
};

// Get User Rooms
const getUserRooms = async (userId: string) => {
  return await prisma.chatRoomParticipant.findMany({
    where: { userId },
    select: {
      chatRoom: {
        select: {
          id: true,
          name: true,
          updatedAt: true,
          projectId: true,
          teamId: true,
        },
      },
    },
    orderBy: {
      chatRoom: {
        updatedAt: "desc", 
      },
    },
  });
};

export const chatService = {
  saveMessageToDB,
  getMessagesFromDB,
  createRoomInDB,
  getRoomsFromDB,
  addParticipantToRoom,
  removeParticipantFromRoom,
  getRoomParticipants,
  getUserRooms,
};
