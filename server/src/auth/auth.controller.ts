import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import {
  AuthSigninCredentialsDto,
  AuthSignupCredentialsDto,
} from './dto/auth.credentials.dto';
import { GoogleAuthGuard } from './utils/Guards';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLoginRedirect(@Req() req): Promise<void> {
    // redirect google login page
    // return { msg: 'Google Authentication' };
  }

  // api/auth/google/redirect
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleLoginCallback(@Req() req) {
    // return { msg: 'OK' };
    // return this.authService.googleRedirect(req);
    // after google login, redirect to frontend server url which is "http://localhost:3000"
    const res = this.authService.googleLoginCallback(req);
    return res;
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
  ): Promise<object> {
    return this.authService.signIn(authSigninCredentialsDto);
  }
}
