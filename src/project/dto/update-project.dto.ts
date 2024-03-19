import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiProperty({ description: '프로젝트 상태', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: '프로젝트 작성 단계', required: false })
  @IsString()
  @IsOptional()
  creationStage?: string;

  @ApiProperty({ description: '프로젝트 진행 단계', required: false })
  @IsString()
  @IsOptional()
  progressStage?: string;

  @ApiProperty({ description: '프로젝트 구축 단계', required: false })
  @IsString()
  @IsOptional()
  buildStage?: string;
}
