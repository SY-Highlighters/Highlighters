import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedModule } from './feed/feed.module';
import { PrismaModule } from './repository/prisma.module';
import { HighlightModule } from './highlight/highlight.module';

@Module({
  imports: [
    FeedModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    HighlightModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
