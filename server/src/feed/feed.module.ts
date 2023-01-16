import { CacheModule, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { HighlightService } from 'src/highlight/highlight.service';
import { TagService } from 'src/tag/tag.service';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    AuthModule,
    // CacheModule.register({
    //   store: redisStore,
    //   ttl: 10,
    //   url: process.env.REDIS_URL,
    // }),
  ],
  controllers: [FeedController],
  providers: [FeedService, HighlightService, TagService],
})
export class FeedModule {}
