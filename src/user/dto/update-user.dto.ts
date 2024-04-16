import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enum/roles.enum';
import { UserStatus } from '../enum/status.enum';

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

  @ApiProperty({
    description: '유저 상태',
    required: false,
    enum: ['재직중, 휴직, 퇴사'],
  })
  @IsString()
  @IsOptional()
  status?: UserStatus;

  @ApiProperty({ description: '적용일', required: false })
  @IsString()
  @IsOptional()
  modifiedDate?: string;
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
