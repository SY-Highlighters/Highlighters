import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { NotiController } from './noti.controller';
import { NotiService } from './noti.service';

@Module({
  imports: [AuthModule],
  controllers: [NotiController],
  providers: [NotiService],
})
export class NotiModule {}
