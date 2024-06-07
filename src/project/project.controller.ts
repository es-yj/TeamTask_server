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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Role } from 'src/user/enum/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Project } from './entities/project.entity';
import { GetProjectDto } from './dto/get-project.dto';

@ApiTags('Project')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('access'))
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({
    summary: '프로젝트 생성',
    description: '권한: 팀장, 실장, 관리자',
  })
  @Roles(Role.TM, Role.VM, Role.Admin)
  @UseGuards(RolesGuard)
  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    return await this.projectService.createProject(createProjectDto);
  }

  @ApiOperation({ summary: '전체 프로젝트 조회' })
  @ApiResponse({ status: 200, type: GetProjectDto })
  @Get()
  async findAllProjects() {
    return await this.projectService.findAllProjects();
  }

  @ApiParam({ name: 'id', required: true, description: 'project id' })
  @ApiOperation({ summary: '개별 프로젝트 조회' })
  @ApiResponse({ status: 200, type: GetProjectDto })
  @Get(':id')
  async getProjectDetail(@Param('id') id: string) {
    return this.projectService.getProjectDetail(+id);
  }

  @ApiParam({ name: 'id', required: true, description: 'project id' })
  @ApiOperation({
    summary: '프로젝트 수정',
    description: '권한: PM, 팀장, 실장, 관리자',
  })
  @Roles(Role.SrPM, Role.JrPM, Role.TM, Role.VM, Role.Admin)
  @UseGuards(RolesGuard)
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
  @ApiOperation({ summary: '프로젝트 삭제', description: '팀장, 실장, 관리자' })
  @Roles(Role.TM, Role.VM, Role.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async removeProject(@Param('id') id: string) {
    return await this.projectService.removeProject(+id);
  }
}
