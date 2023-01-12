import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/repository/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 구글 로그인 redirect
  async googleRedirect(req) {
    if (!req.user_with_token) {
      return 'No user from google';
    }
    // return {
    //   message: 'User information from google',
    //   user: req.user,
    // };

    const user = await this.prismaService.user.findUnique({
      where: { email: req.user_with_token.email },
    });

    // if user does not exist in db, create newuser and return accesstoken
    // 회원가입 + 로그인
    if (!user) {
      const newUser = await this.prismaService.user.create({
        data: {
          email: req.user_with_token.email,
          nickname: req.user_with_token.lastName,
          image: req.user_with_token.image,
        },
      });
      return req.user_with_token.accessToken;
    }

    // if user already exists in db, return accesstoken
    // 로그인
    return req.user_with_token.accessToken;
  }

  // // 회원가입
  // async signUp(
  //   authSignupCredentialsDto: AuthSignupCredentialsDto,
  // ): Promise<User> {
  //   const { email, password, nickname } = authSignupCredentialsDto;

  //   const salt = await bcrypt.genSalt();
  //   const hashedPassword = await bcrypt.hash(password, salt);

  //   const user = this.prismaService.user.create({
  //     data: {
  //       email,
  //       password: hashedPassword,
  //       image:
  //         'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Font_Awesome_5_regular_user-circle.svg/1200px-Font_Awesome_5_regular_user-circle.svg.png',
  //       nickname,
  //     },
  //   });

  //   return user;
  // }

  // // 로그인
  // async signIn(
  //   authSigninCredentialsDto: AuthSigninCredentialsDto,
  // ): Promise<object> {
  //   const { email, password } = authSigninCredentialsDto;
  //   const user = await this.prismaService.user.findUnique({
  //     where: { email: email },
  //   });

  //   if (user && (await bcrypt.compare(password, user.password))) {
  //     // 유저 토큰 생성 ( Secret + Payload )
  //     const payload = { email };
  //     const accessToken = await this.jwtService.sign(payload);

  //     const userInfo = {
  //       ...user,
  //       accessToken,
  //     };

  //     if (user.group_id) {
  //       const group = await this.prismaService.group.findUnique({
  //         where: { id: user.group_id },
  //       });

  //       userInfo['group_name'] = group.name;
  //     }
  //     return userInfo;
  //   } else {
  //     throw new UnauthorizedException('login failed');
  //   }
  // }
}
