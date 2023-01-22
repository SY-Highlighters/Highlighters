import { CacheModule, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    AuthModule,
    CacheModule.register({
      store: redisStore,
      url: process.env.REDIS_URL,
    }),
  ],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
