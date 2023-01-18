import { CacheModule, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { FeedService } from 'src/feed/feed.service';
import { TagService } from 'src/tag/tag.service';
import { HighlightController } from './highlight.controller';
import { HighlightService } from './highlight.service';
import * as redisStore from 'cache-manager-redis-store';
import { EventModule } from 'src/event/event.module';

@Module({
  imports: [
    AuthModule,
    EventModule,
    // CacheModule.register({
    //   store: redisStore,
    //   ttl: 10,
    //   url: process.env.REDIS_URL,
    // }),
  ],
  controllers: [HighlightController],
  providers: [HighlightService, FeedService, TagService],
})
export class HighlightModule {}
