import { IsNotEmpty, IsNumber } from 'class-validator';
export class UpdateTeamInfoDto {
  @IsNumber()
  @IsNotEmpty({ message: '팀 정보는 필수로 입력해야 합니다.' })
  team: number;
}
