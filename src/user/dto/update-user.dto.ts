import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: '팀 정보', required: false })
  @IsOptional()
  @IsNumber()
  team?: number;

  @ApiProperty({ description: '직책', required: false })
  @IsString()
  @IsOptional()
  position?: string;
}
