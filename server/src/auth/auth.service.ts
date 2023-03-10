import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import {
  AuthSigninCredentialsDto,
  AuthSignupCredentialsDto,
} from './dto/auth.credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 구글 로그인
  async googleLogin({ email, name, image }): Promise<any> {
    const user = await this.prismaService.user.upsert({
      where: { email: email },
      create: {
        email: email,
        nickname: name,
        image: image,
        password: 'google',
      },
      update: {},
    });
    return {
      accessToken: this.jwtService.sign({ email: user.email }),
    };

    // // db에 유저 정보가 있는지 확인
    // const user = await this.prismaService.user.findUnique({
    //   where: { email: email },
    // });
    // console.log('inside the googleLogin service', 'user: ', user);

    // // if user does not exist in db, create newuser and return userinfo with accesstoken
    // // db에 유저가 없다면, 회원가입 + 로그인
    // if (!user) {
    //   const newUser = await this.prismaService.user.create({
    //     data: {
    //       email: email,
    //       nickname: name,
    //       image: image,
    //       password: 'google',
    //     },
    //   });
    //   return {
    //     accessToken: this.jwtService.sign({ email: newUser.email }),
    //   };
    // }

    // // if user already exists in db, return userinfo with accesstoken
    // // db에 유저가 있다면, 로그인
    // return {
    //   accessToken: this.jwtService.sign({ email: user.email }),
    // };
  }

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
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Font_Awesome_5_regular_user-circle.svg/1200px-Font_Awesome_5_regular_user-circle.svg.png',
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
}
