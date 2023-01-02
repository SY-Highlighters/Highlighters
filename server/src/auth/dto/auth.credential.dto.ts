import { IsString, MaxLength, MinLength } from "class-validator";

export class AuthSignupCredentialsDto {
    @IsString()
    @MinLength(4)
    @MaxLength(100)    
    email: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    password: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    nickname: string;
}

export class AuthSigninCredentialsDto {
    @IsString()
    @MinLength(4)
    @MaxLength(100)    
    email: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    password: string;
}