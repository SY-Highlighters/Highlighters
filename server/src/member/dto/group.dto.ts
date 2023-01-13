import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateGroupDto {
  @IsEmail()
  @IsOptional()
  user_email: string;

  @IsNotEmpty()
  name: string;
}

export class showUserDto {
  email: string;
  nickname: string;
  image: string;
}
