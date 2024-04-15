import { Repository } from 'typeorm';
import { CustomRepository } from 'src/common/decorators/typeorm-repository.decorator';
import { Project } from './entities/project.entity';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectManager } from './entities/project-manager.entity';

@CustomRepository(Project)
export class ProjectRepository extends Repository<Project> {
  async createProject(project: Project) {
    const newProject = await this.create(project);
    return await this.save(newProject);
  }

  async findAllProjects(): Promise<Project[] | null> {
    const projects = await this.createQueryBuilder('project')
      .leftJoinAndSelect('project.managers', 'user')
      .select([
        'project.id',
        'project.projectId',
        'project.client',
        'project.creationStage',
        'project.status',
        'project.progressStage',
        'project.buildStage',
        'project.slackUrl',
        'project.createdAt',
        'project.updatedAt',
        'user.id',
        'user.name',
        'user.role',
        'user.team',
      ])
      .getMany();
    return projects;
  }

  async findProjectById(id: number): Promise<Project | null> {
    const project = await this.createQueryBuilder('project')
      .leftJoinAndSelect('project.managers', 'user')
      .where('project.id=:id', { id })
      .select([
        'project.id',
        'project.projectId',
        'project.client',
        'project.creationStage',
        'project.status',
        'project.progressStage',
        'project.buildStage',
        'project.slackUrl',
        'project.createdAt',
        'project.updatedAt',
        'user.id',
        'user.name',
        'user.role',
        'user.team',
      ])
      .getOne();
    return project;
  }

  async updateProject(id: number, updateProjectDto: UpdateProjectDto) {
    return await this.update(id, updateProjectDto);
  }

  async removeProject(id: number): Promise<any> {
    await this.manager
      .createQueryBuilder()
      .delete()
      .from(ProjectManager)
      .where('projectId = :id', { id })
      .execute();

    return this.delete(id);
  }
}
