import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedController } from './feed/controller/feed.controller';
import { FeedModule } from './feed/feed.module';

@Module({
  imports: [FeedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
