import { IsNotEmpty, IsString, IsEmail, IsUrl } from 'class-validator';

export class SocialLoginInfoDto {
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsUrl()
  picture: string;
}
