import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway()
export class EventGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  public group_room = {};

  onModuleInit() {
    this.server.on('connection', (client) => {
      console.log('client connected');

      client.on('message', (message) => {
        const msg = JSON.parse(message.toString());

        if (msg.event === 'userinfo') {
          const userInfo = msg.userInfo;
          if (this.group_room[userInfo.group_id])
            this.group_room[userInfo.group_id].push(client);
          else this.group_room[userInfo.group_id] = [client];
        }
      });

      // client.send(
      //   JSON.stringify({
      //     event: 'push',
      //     data: 'HELLO THERE!!!',
      //   }),
      // );
    });
  }
}
