// src/server.ts

import http from 'http';
import app from './app';
import config from './config';
import { Server as SocketIOServer } from 'socket.io';
import { chatGateway } from './app/modules/chat/chat.gateway';

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: config.frontend_base_url,
    credentials: true,
  },
});

chatGateway(io); 

server.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
});
