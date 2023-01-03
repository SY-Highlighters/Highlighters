import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { FeedService } from 'src/feed/feed.service';
import { HighlightController } from './highlight.controller';
import { HighlightService } from './highlight.service';

@Module({
  imports: [AuthModule],
  controllers: [HighlightController],
  providers: [HighlightService, FeedService],
})
export class HighlightModule {}
