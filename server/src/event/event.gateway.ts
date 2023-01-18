import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway({ path: '/api/ws' })
export class EventGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  public group_room = {};
  public user_client;

  onModuleInit() {
    this.server.on('connection', (client) => {
      console.log('===== client connected =====');
      this.user_client = client;

      client.on('message', (message) => {
        const msg = JSON.parse(message.toString());

        if (msg.event === 'userinfo') {
          const userInfo = msg.userInfo;
          if (this.group_room[userInfo.group_id])
            this.group_room[userInfo.group_id].push(client);
          else this.group_room[userInfo.group_id] = [client];
        }
      });

      client.on('close', () => {
        console.log('===== client disconnected ======');

        // group_room에서 해당 client 삭제
        for (const group_id in this.group_room) {
          const index = this.group_room[group_id].indexOf(client);
          if (index > -1) {
            this.group_room[group_id].splice(index, 1);
          }
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
