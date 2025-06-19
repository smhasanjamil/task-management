import { Request, Response } from "express";
import status from "http-status";
import { Server as SocketServer } from "socket.io";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { chatService } from "./chat.service";

const createRoom = catchAsync(async (req: Request, res: Response) => {
  const { name, projectId, teamId } = req.body;

  const result = await chatService.createRoomInDB({
    name,
    projectId,
    teamId,
  });

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Chat room created successfully",
    data: result,
  });
});

// Send message
const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const { roomId, senderId, content } = req.body;
  const io: SocketServer = req.app.get("io");

  // Save message to database using proper relation syntax
  const result = await chatService.saveMessageToDB({
    content,
    room: { connect: { id: roomId } },
    sender: { connect: { id: senderId } },
  });

  // Emit the message to all clients in the room
  io.to(`chat_${roomId}`).emit("newMessage", result);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Message sent successfully",
    data: result,
  });
});

// Get messages for a room
const getRoomMessages = catchAsync(async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const result = await chatService.getMessagesFromDB(roomId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Messages retrieved successfully",
    data: result,
  });
});

// Join chat room
const joinRoom = catchAsync(async (req: Request, res: Response) => {
  const { roomId, userId } = req.body;
  const io: SocketServer = req.app.get("io");

  const socketId = req.headers["socket-id"];
  if (socketId && typeof socketId === "string") {
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
      socket.join(`chat_${roomId}`);
    }
  }

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Joined room successfully",
    data: null,
  });
});

const getRooms = catchAsync(async (req: Request, res: Response) => {
  const result = await chatService.getRoomsFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Room retrieved successfully",
    data: result,
  });
});

// Add Participant to Room
const addParticipant = catchAsync(async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { userId } = req.body;

  const result = await chatService.addParticipantToRoom(roomId, userId);

  // Safely access Socket.IO
  const io: SocketServer = req.app.get("io");
  io?.to(`chat_${roomId}`).emit("participantAdded", result);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Participant added successfully",
    data: result,
  });
});

// Remove Participant from Room
const removeParticipant = catchAsync(async (req: Request, res: Response) => {
  const { roomId, userId } = req.params;
  const io: SocketServer = req.app.get("io");

  // Service handles everything - returns removed participant data
  const result = await chatService.removeParticipantFromRoom(roomId, userId);

  // Notify room (controller only handles transport)
  io.to(`chat_${roomId}`).emit("participantRemoved", result);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Participant removed successfully",
    data: result,
  });
});

// Get Room Participants
const getParticipants = catchAsync(async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const result = await chatService.getRoomParticipants(roomId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Participants retrieved successfully",
    data: result,
  });
});

// Get User Rooms
const getUserRooms = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const participants = await chatService.getUserRooms(userId);

  const rooms = participants.map((p) => p.chatRoom);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User rooms retrieved successfully",
    data: rooms,
  });
});

export const chatController = {
  createRoom,
  sendMessage,
  getRoomMessages,
  joinRoom,
  getRooms,
  addParticipant,
  removeParticipant,
  getParticipants,
  getUserRooms,
};
