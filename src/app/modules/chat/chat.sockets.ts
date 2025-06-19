import { Server as SocketServer } from 'socket.io';
import prisma from "../../../lib/prisma";

export const configureChatSockets = (io: SocketServer) => {
  io.of('/chat').on('connection', (socket) => {
    console.log(`New chat connection: ${socket.id}`);

    // Join room handler
    socket.on('join_room', async (roomId: string) => {
      try {
        // Verify user has access to room
        const participant = await prisma.chatRoomParticipant.findFirst({
          where: {
            chatRoomId: roomId,
            userId: socket.data.userId
          }
        });

        if (!participant) {
          throw new Error('Unauthorized room access');
        }

        socket.join(`chat_${roomId}`);
        console.log(`User ${socket.data.userId} joined chat_${roomId}`);
        
        socket.emit('room_joined', { success: true });
      } catch (error: unknown) {
        if (error instanceof Error) {
          socket.emit('error', { message: error.message });
        } else {
          socket.emit('error', { message: 'An unknown error occurred' });
        }
      }
    });

    // Message handler
    socket.on('send_message', async (data: {
      roomId: string;
      content: string;
    }) => {
      try {
        // Validate
        if (!data.content.trim()) {
          throw new Error('Message cannot be empty');
        }

        // Save to database
        const message = await prisma.message.create({
          data: {
            content: data.content,
            roomId: data.roomId,
            senderId: socket.data.userId
          },
          include: {
            sender: true,
            room: true
          }
        });

        // Broadcast to room
        io.of('/chat').to(`chat_${data.roomId}`).emit('new_message', message);
      } catch (error: unknown) {
        if (error instanceof Error) {
          socket.emit('error', { message: error.message });
        } else {
          socket.emit('error', { message: 'Failed to send message' });
        }
      }
    });

    socket.on('disconnect', () => {
      console.log(`Chat connection ${socket.id} disconnected`);
    });
  });
};