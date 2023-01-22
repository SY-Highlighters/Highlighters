import { CacheModule, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    AuthModule,
    CacheModule.register({
      store: redisStore,
      url: process.env.REDIS_URL,
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
