import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@ApiTags('Project')
@UseGuards(AuthGuard('access'))
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({ summary: '프로젝트 생성' })
  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    return await this.projectService.createProject(createProjectDto);
  }

  @ApiOperation({ summary: '전체 프로젝트 조회' })
  @Get()
  async findAllProjects() {
    return await this.projectService.findAllProjects();
  }

  @ApiParam({ name: 'id', required: true, description: 'project id' })
  @ApiOperation({ summary: '개별 프로젝트 조회' })
  @Get(':id')
  async getProjectDetail(@Param('id') id: string) {
    return this.projectService.getProjectDetail(+id);
  }

  @ApiParam({ name: 'id', required: true, description: 'project id' })
  @ApiOperation({ summary: '프로젝트 수정' })
  @Patch(':id')
  async updateProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @GetUser() userId: number,
  ) {
    return await this.projectService.updateProject(
      +id,
      userId,
      updateProjectDto,
    );
  }

  @ApiParam({ name: 'id', required: true, description: 'project id' })
  @ApiOperation({ summary: '프로젝트 삭제' })
  @Delete(':id')
  async removeProject(@Param('id') id: string) {
    return await this.projectService.removeProject(+id);
  }
}
