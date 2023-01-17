import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { EventModule } from 'src/event/event.module';
import { NotiController } from './noti.controller';
import { NotiService } from './noti.service';

@Module({
  imports: [AuthModule, EventModule],
  controllers: [NotiController],
  providers: [NotiService],
})
export class NotiModule {}
