import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface GoogleUser {
  email: string;
  name: string;
  picture: string;
}

export type GoogleRequest = Request & { user: GoogleUser };

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: '이메일은 필수적으로 입력해야 합니다.' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: '이름은 필수적으로 입력해야 합니다.' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  picture: string;
}
