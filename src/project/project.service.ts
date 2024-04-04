import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectRepository } from './project.repository';
import { SlackService } from 'src/common/slack.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectRepository)
    private readonly projectRepository: ProjectRepository,
    private readonly userService: UserService,
    private readonly slackService: SlackService,
  ) {}

  async createProject(createProjectDto: CreateProjectDto) {
    try {
      const { managerId } = createProjectDto;
      const manager = await this.userService.findUserById(managerId);

      if (!manager) {
        throw new NotFoundException('해당 id의 담당자를 찾을 수 없습니다.');
      }

      const newProject =
        await this.projectRepository.createProject(createProjectDto);

      await this.slackService.sendSlackMessage(
        `🟢 프로젝트 생성 (${manager.name}님)\n  - 프로젝트 ID: ${newProject.projectId}\n  - 고객사: ${newProject.client} 프로젝트가 생성되었습니다.`,
      );
      return { msg: '프로젝트 생성에 성공하였습니다.' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        '프로젝트 생성에 실패했습니다. | ' + error.message,
      );
    }
  }

  async findAllProjects() {
    try {
      const projects = this.projectRepository.findAllProjects();
      return projects;
    } catch (error) {
      throw new InternalServerErrorException(
        '전체 프로젝트 조회에 실패했습니다.',
      );
    }
  }

  async getProjectDetail(id: number) {
    try {
      const project = this.projectRepository.findProjectById(id);
      if (!project) {
        throw new NotFoundException('해당 id의 프로젝트를 찾을 수 없습니다.');
      }
      return project;
    } catch (error) {
      throw new InternalServerErrorException('프로젝트 조회에 실패했습니다.');
    }
  }

  async updateProject(
    id: number,
    userId: number,
    updateProjectDto: UpdateProjectDto,
  ) {
    try {
      const project = await this.projectRepository.findProjectById(id);
      if (!project) {
        throw new NotFoundException('해당 id의 프로젝트를 찾을 수 없습니다.');
      }

      const changes = this.getChanges(project, updateProjectDto);
      await this.projectRepository.updateProject(id, updateProjectDto);

      const user = await this.userService.findUserById(userId);

      if (changes.length > 0) {
        await this.slackService.sendSlackMessage(
          `🔵 프로젝트 수정 (${user.name}님)\n  - 프로젝트 ID: ${project.projectId}\n  - 수정사항: [${changes.join(', ')}]`,
        );
      }

      return { msg: '프로젝트 수정에 성공했습니다.' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('프로젝트 수정에 실패했습니다.');
    }
  }

  async removeProject(id: number) {
    try {
      const deletionResult = await this.projectRepository.removeProject(id);
      if (deletionResult.affected === 0) {
        throw new NotFoundException(
          `ID: ${id}인 프로젝트를 찾을 수 없어 삭제할 수 없습니다.`,
        );
      }

      return { msg: '프로젝트 삭제에 성공했습니다.' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('프로젝트 삭제에 실패했습니다.');
    }
  }

  private getChanges(project: any, updateDto: UpdateProjectDto) {
    const fieldDescriptions = {
      status: '프로젝트 상태',
      creationStage: '프로젝트 작성 단계',
      progressStage: '프로젝트 진행 단계',
      buildStage: '프로젝트 구축 단계',
    };

    return Object.entries(updateDto)
      .filter(([key, value]) => project[key] !== value)
      .map(([key, value]) => {
        const fieldName = fieldDescriptions[key] || key;
        return `${fieldName}(${project[key]} -> ${value})`;
      });
  }
}
