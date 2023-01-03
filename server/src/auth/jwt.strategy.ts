import { User } from '.prisma/client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/repository/prisma.service';
import { AuthService } from './auth.service';

@Injectable() // 다른 곳에서도 사용하기 위함
export class JwtStrategy extends PassportStrategy(Strategy) {
  // jwt strategy 사용
  constructor(private readonly prismaService: PrismaService) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const { email } = payload;
    const user: User = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

export interface JwtPayload {
  email: string;
  group_id: number;
}
