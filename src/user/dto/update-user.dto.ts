import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enum/roles.enum';

export class UpdateUserDto {
  @ApiProperty({ description: '팀 정보', required: false })
  @IsOptional()
  @IsNumber()
  team?: number;

  @ApiProperty({
    description: '직책',
    required: false,
    enum: ['PA', 'Sr.PM', 'Jr.PM', '팀장', '실장', '관리자'],
  })
  @IsString()
  @IsOptional()
  role?: Role;
}

export class UpdateUserStatusDto {
  @ApiProperty({
    description: '승인 여부',
    required: false,
    enum: ['승인', '거절'],
  })
  @IsString()
  @IsOptional()
  status?: string;
}
