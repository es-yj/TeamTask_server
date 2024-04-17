import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto {
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

  @ApiProperty({ description: '프로젝트 영업 담당자 이름', required: false })
  @IsString()
  @IsOptional()
  salesManager?: string;
}

export class UpdateContractDto {
  @ApiProperty({ description: '계약금액', required: false })
  @IsNumber()
  @IsOptional()
  amount: number;

  @ApiProperty({ description: '프로젝트 유형', required: false })
  @IsString()
  @IsOptional()
  projectForm: string;

  @ApiProperty({ description: '데이터 유형', required: false })
  @IsString()
  @IsOptional()
  dataForm: string;

  @ApiProperty({ description: '계약 시작일', required: false })
  @IsDate()
  @IsOptional()
  startDate: Date;

  @ApiProperty({ description: '계약 종료일', required: false })
  @IsDate()
  @IsOptional()
  endDate: Date;
}

export class UpdateDeliveryDto {
  @ApiProperty({ description: '납품일', required: false })
  @IsDate()
  @IsOptional()
  deliveryDate: Date;

  @ApiProperty({ description: '데이터 단위', required: false })
  @IsNumber()
  @IsOptional()
  amount: number;
  unit: string;

  @ApiProperty({ description: '전체 납품 수량', required: false })
  @IsNumber()
  @IsOptional()
  totalDeliveryCount: number;

  @ApiProperty({ description: '납품량', required: false })
  @IsNumber()
  @IsOptional()
  deliveryCount: number;

  @ApiProperty({ description: '생산량', required: false })
  @IsNumber()
  @IsOptional()
  productionCount: number;
}
