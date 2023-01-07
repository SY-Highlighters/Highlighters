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
  ): Promise<object> {
    const { email, password } = authSigninCredentialsDto;
    const user = await this.prismaService.user.findUnique({
      where: { email: email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      // 유저 토큰 생성 ( Secret + Payload )
      const payload = { email };
      const accessToken = await this.jwtService.sign(payload);

      const userInfo = {
        ...user,
        accessToken,
      };

      if (user.group_id) {
        const group = await this.prismaService.group.findUnique({
          where: { id: user.group_id },
        });

        userInfo['group_name'] = group.name;
      }

      return userInfo;
    } else {
      throw new UnauthorizedException('login failed');
    }
  }

  // 구글 로그인
  async googleLogin(json) {
    if (!json) {
      return 'No user from google';
    }
    const user_email = json.userProfile.email;
    let find_user = await this.prismaService.user.findUnique({
      where: { email: user_email },
    });

    // 가입하지 않았을 경우, 자동 signup
    if (!find_user) {
      const new_signup_dto = new AuthSignupCredentialsDto();
      new_signup_dto.email = user_email;
      new_signup_dto.password = 'random_password';
      new_signup_dto.nickname = json.userProfile.firstName;

      find_user = await this.signUp(new_signup_dto);
    }

    // sign in
    const new_signin_dto = new AuthSigninCredentialsDto();
    new_signin_dto.email = user_email;
    new_signin_dto.password = 'random_password';
    const res = await this.signIn(new_signin_dto);
    console.log(res);

    return res;
  }
}
