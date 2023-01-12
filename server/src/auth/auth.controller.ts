import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './utils/Guards';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async handleGoogleLogin(@Req() req): Promise<void> {
    // redirect google login page
    // return { msg: 'Google Authentication' };
    // return this.authService.googleLogin();
  }

  // api/auth/google/redirect
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleRedirect(@Req() req) {
    // return { msg: 'OK' };
    return this.authService.googleRedirect(req);
  }
}
