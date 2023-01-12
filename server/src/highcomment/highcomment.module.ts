import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { HighcommentController } from './highcomment.controller';
import { HighcommentService } from './highcomment.service';

@Module({
  imports: [AuthModule],
  controllers: [HighcommentController],
  providers: [HighcommentService],
})
export class HighcommentModule {}
