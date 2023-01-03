import { Module } from '@nestjs/common';
import { FeedService } from 'src/feed/feed.service';
import { HighlightController } from './highlight.controller';
import { HighlightService } from './highlight.service';

@Module({
  imports: [],
  controllers: [HighlightController],
  providers: [HighlightService, FeedService],
})
export class HighlightModule {}
