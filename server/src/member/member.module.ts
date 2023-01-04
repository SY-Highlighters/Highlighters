import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';

@Module({
  imports: [AuthModule],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
