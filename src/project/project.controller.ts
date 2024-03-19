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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/get-user.decorator';

@ApiTags('Project')
@UseGuards(AuthGuard())
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

  @ApiOperation({ summary: '개별 프로젝트 조회' })
  @Get(':id')
  async getProjectDetail(@Param('id') id: string) {
    return this.projectService.getProjectDetail(+id);
  }

  @ApiOperation({ summary: '프로젝트 수정' })
  @Patch(':id')
  async updateProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @GetUser() userId: number,
  ) {
    console.log(userId);
    return await this.projectService.updateProject(
      +id,
      userId,
      updateProjectDto,
    );
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.projectService.remove(+id);
  // }
}
