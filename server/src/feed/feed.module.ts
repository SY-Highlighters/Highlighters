import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { HighlightService } from 'src/highlight/highlight.service';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [AuthModule],
  controllers: [FeedController],
  providers: [FeedService, HighlightService],
})
export class FeedModule {}
