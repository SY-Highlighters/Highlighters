import { CacheModule, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { FeedService } from 'src/feed/feed.service';
import { TagService } from 'src/tag/tag.service';
import { HighlightController } from './highlight.controller';
import { HighlightService } from './highlight.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    AuthModule,
    CacheModule.register({
      store: redisStore,
      ttl: 10,
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
      },
    }),
  ],
  controllers: [HighlightController],
  providers: [HighlightService, FeedService, TagService],
})
export class HighlightModule {}
