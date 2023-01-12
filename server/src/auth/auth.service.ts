import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    if (!req.user) {
      throw new UnauthorizedException('No User from Google: login failed');
    }

    // db에 유저 정보가 있는지 확인
    const user = await this.prismaService.user.findUnique({
      where: { email: req.user.email },
    });

    // if user does not exist in db, create newuser and return userinfo with accesstoken
    // db에 유저가 없다면, 회원가입 + 로그인
    if (!user) {
      const newUser = await this.prismaService.user.create({
        data: {
          email: req.user.email,
          nickname: req.user.lastName + req.user.firstName,
          image: req.user.image,
        },
      });
      const email = req.user.email;
      const payload = { email };
      const accessToken = await this.jwtService.sign(payload);
      const userInfo = {
        ...newUser,
        accessToken,
      };
      return userInfo;
    }

    // if user already exists in db, return userinfo with accesstoken
    // db에 유저가 있다면, 로그인
    const email = req.user.email;
    const payload = { email };
    const accessToken = await this.jwtService.sign(payload);
    const userInfo = {
      ...user,
      accessToken,
    };
    return userInfo;
  }
}
