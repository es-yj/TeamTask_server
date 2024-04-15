import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class UpdateTeamInfoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '팀 정보는 필수로 입력해야 합니다.' })
  team: string;
}
