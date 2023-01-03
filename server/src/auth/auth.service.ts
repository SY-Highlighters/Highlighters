import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/repository/prisma.service';
import {
  AuthSigninCredentialsDto,
  AuthSignupCredentialsDto,
} from './dto/auth.credential.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 회원가입
  async signUp(
    authSignupCredentialsDto: AuthSignupCredentialsDto,
  ): Promise<User> {
    const { email, password, nickname } = authSignupCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname,
      },
    });
    return user;
  }

  // 로그인
  async signIn(
    authSigninCredentialsDto: AuthSigninCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authSigninCredentialsDto;
    const user = await this.prismaService.user.findUnique({
      where: { email: email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      // 유저 토큰 생성 ( Secret + Payload )
      const payload = { email };
      const accessToken = await this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('login failed');
    }
  }
}
