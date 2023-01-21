import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway({ path: '/api/ws' })
export class EventGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  public group_room = {};
  public userInfo;

  onModuleInit() {
    this.server.on('connection', (client) => {
      console.log('===== client connected =====');

      client.on('message', (message) => {
        const msg = JSON.parse(message.toString());

        if (msg.event === 'userinfo') {
          this.userInfo = msg.userInfo;

          client['email'] = this.userInfo.email;

          if (this.group_room[this.userInfo.group_id])
            this.group_room[this.userInfo.group_id].push(client);
          else this.group_room[this.userInfo.group_id] = [client];

          console.log(`GROUP ${this.userInfo.group_id} USER LIST`);
          this.group_room[this.userInfo.group_id].forEach((cl) => {
            console.log(cl['email']);
          });
        }
      });

      client.on('close', () => {
        console.log('===== client disconnected ======');
        for (const group_id in this.group_room) {
          const index = this.group_room[group_id].indexOf(client);
          if (index > -1) {
            this.group_room[group_id].splice(index, 1);

            console.log(`GROUP ${this.userInfo.group_id} USER LIST`);
            this.group_room[group_id].forEach((cl) => {
              console.log(cl['email']);
            });
          }
        }
      });
    });
  }
}
