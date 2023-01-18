import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';
import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';

@Module({
  imports: [AuthModule, HttpModule],
  controllers: [SummaryController],
  providers: [SummaryService],
})
export class SummaryModule {}
