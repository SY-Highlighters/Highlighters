import { OnModuleInit } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket);
      console.log('Client connected');
    });
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string) {
    console.log(data);

    this.server.emit('message', data);

    return { data };
  }
}
