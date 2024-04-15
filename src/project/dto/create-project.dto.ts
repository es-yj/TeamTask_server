import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: '유저 목록에서 담당자를 선택하고 id를 가져옵니다.',
  })
  @IsNumber()
  managerId: number; // 담당 PM : User 테이블의 사용자 id

  @ApiProperty()
  @IsNotEmpty({ message: '프로젝트ID는 필수적으로 입력해야 합니다.' })
  @IsString()
  projectId: string;

  @ApiProperty()
  @IsNotEmpty({ message: '고객사는 필수적으로 입력해야 합니다.' })
  @IsString()
  client: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  slackUrl: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  notionUrl: string;
}
