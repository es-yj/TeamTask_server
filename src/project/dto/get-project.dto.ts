import { ApiProperty } from '@nestjs/swagger';
import { ManagerDto } from 'src/user/dto/manager-dto';

export class GetProjectDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  creationStage: string;
  @ApiProperty()
  projectId: string;
  @ApiProperty()
  client: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  progressStage: string;
  @ApiProperty()
  buildStage: string;
  @ApiProperty()
  slackUrl: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty({ type: [ManagerDto], description: 'Array of managers' })
  managers: ManagerDto[];
}
