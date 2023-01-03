import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import {
  AuthSigninCredentialsDto,
  AuthSignupCredentialsDto,
} from './dto/auth.credential.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 구글 로그인 메인 화면
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
  }

  // 구글 로그인 콜백
  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req)
  }

  @Post('/signup')
  signUp(
    @Body() authSignupCredentialsDto: AuthSignupCredentialsDto,
  ): Promise<User> {
    return this.authService.signUp(authSignupCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body() authSigninCredentialsDto: AuthSigninCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authSigninCredentialsDto);
  }

  
}
