import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateGroupDto {
  @IsEmail()
  user_email: string;

  @IsNotEmpty()
  name: string;
}
