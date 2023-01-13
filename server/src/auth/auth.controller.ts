import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import {
  AuthSigninCredentialsDto,
  AuthSignupCredentialsDto,
} from './dto/auth.credentials.dto';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('google/login')
  async googleLogin(@Body('accessToken') accessToken): Promise<any> {
    const ticket = await client.verifyIdToken({
      idToken: accessToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    if (!ticket) {
      throw new UnauthorizedException('No User from Google: login failed');
    }
    // log the ticket payload in the console to see what's inside
    console.log('ticket: ', ticket.getPayload());
    const { email, name, picture } = ticket.getPayload();
    const data = await this.authService.googleLogin({
      email,
      name,
      image: picture,
    });
    return {
      data,
      message: 'success',
    };
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
