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
import { UserRepository } from 'src/user/user.repository';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectRepository)
    private readonly projectRepository: ProjectRepository,
    private readonly userService: UserService,
  ) {}

  async createProject(createProjectDto: CreateProjectDto) {
    try {
      const { managerId } = createProjectDto;
      const manager = this.userService.findUserById(managerId);

      await this.projectRepository.createProject(createProjectDto);

      return { msg: '프로젝트 생성에 성공하였습니다.' };
    } catch (error) {
      throw new InternalServerErrorException(
        '프로젝트 생성에 실패했습니다. | ' + error,
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
      const project = this.projectRepository.findProjectById(id);
      if (!project) {
        throw new NotFoundException('해당 id의 프로젝트를 찾을 수 없습니다.');
      }

      await this.projectRepository.updateProject(id, updateProjectDto);
      return { msg: '프로젝트 수정에 성공했습니다.' };
    } catch (error) {
      throw new InternalServerErrorException('프로젝트 수정에 실패했습니다.');
    }
  }

  async removeProject(id: number) {
    try {
      await this.projectRepository.removeProject(id);
    } catch (error) {
      throw new InternalServerErrorException('프로젝트 삭제에 실패했습니다.');
    }
  }
  // remove(id: number) {
  //   return `This action removes a #${id} project`;
  // }
}
