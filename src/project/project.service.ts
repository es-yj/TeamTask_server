import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectRepository } from './project.repository';
import { SlackService } from 'src/slack/slack.service';
import { Project } from './entities/project.entity';
import { ProjectManager } from './entities/project-manager.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectRepository)
    private readonly projectRepository: ProjectRepository,
    @InjectRepository(ProjectManager)
    private managerRepository: Repository<ProjectManager>,
    private readonly userService: UserService,
    private readonly slackService: SlackService,
    private readonly dataSource: DataSource,
  ) {}

  async createProject(createProjectDto: CreateProjectDto) {
    const { managerId, ...projectData } = createProjectDto;
    const managerUser = await this.userService.findUserById(managerId);

    if (!managerUser) {
      throw new NotFoundException('해당 id의 담당자를 찾을 수 없습니다.');
    }

    const savedProject = await this.handleDatabaseOperation(async (manager) => {
      const newProject = new Project();
      Object.assign(newProject, projectData);
      const savedProject = await this.projectRepository.save(newProject);

      const projectManager = new ProjectManager();
      projectManager.projectId = savedProject.id;
      projectManager.userId = managerUser.id;
      await this.managerRepository.save(projectManager);

      return savedProject;
    });

    await this.slackService.sendSlackMessage(
      `🟢 프로젝트 생성 (${managerUser.name}님)\n  - 프로젝트 ID: ${savedProject.projectId}\n  - 고객사: ${savedProject.client} 프로젝트가 생성되었습니다.`,
    );

    return { msg: '프로젝트 생성에 성공하였습니다.' };
  }

  // 중복된 트랜잭션 처리 로직을 별도의 메소드로 분리
  private async handleDatabaseOperation(
    operation: (manager: EntityManager) => Promise<any>,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await operation(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        '데이터베이스 작업 중 오류가 발생했습니다.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAllProjects() {
    const projects = await this.projectRepository.findAllProjects();
    return projects;
  }

  async getProjectDetail(id: number) {
    const project = await this.projectRepository.findProjectById(id);
    if (!project) {
      throw new NotFoundException('해당 id의 프로젝트를 찾을 수 없습니다.');
    }
    return project;
  }

  async updateProject(
    id: number,
    userId: number,
    updateProjectDto: UpdateProjectDto,
  ) {
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
  }

  async removeProject(id: number) {
    const deletionResult = await this.projectRepository.removeProject(id);
    if (deletionResult.affected === 0) {
      throw new NotFoundException(`해당 id의 프로젝트를 찾을 수 없습니다.`);
    }

    return { msg: '프로젝트 삭제에 성공했습니다.' };
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
