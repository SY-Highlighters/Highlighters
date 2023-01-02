import { Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { AuthSigninCredentialsDto, AuthSignupCredentialsDto } from './dto/auth.credential.dto';

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/signup')
    signUp(@Body() authSignupCredentialsDto: AuthSignupCredentialsDto): Promise<User> {
        return this.authService.signUp(authSignupCredentialsDto);
    }

    @Post('/signin')
    signIn(@Body() authSigninCredentialsDto: AuthSigninCredentialsDto): Promise<{accessToken: string}> {
        return this.authService.signIn(authSigninCredentialsDto);
    }


}
