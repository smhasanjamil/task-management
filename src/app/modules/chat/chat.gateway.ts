
import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';

const prisma = new PrismaClient();

export const chatGateway = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`Connected: ${socket.id}`);

    // Join chat room
    socket.on('join-room', async ({ roomId }) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);

      const messages = await prisma.message.findMany({
        where: { roomId },
        include: { sender: { select: { id: true, userName: true } } },
        orderBy: { createdAt: 'asc' },
      });

      socket.emit('chat-history', messages);
    });

    // Receive and broadcast message
    socket.on('chat-message', async ({ roomId, senderId, content }) => {
      const newMessage = await prisma.message.create({
        data: { roomId, senderId, content },
        include: { sender: { select: { id: true, userName: true } } },
      });

      io.to(roomId).emit('chat-message', newMessage);
    });

    socket.on('disconnect', () => {
      console.log(`Disconnected: ${socket.id}`);
    });
  });
};
