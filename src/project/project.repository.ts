import { Repository } from 'typeorm';
import { CustomRepository } from 'src/common/typeorm-repository.decorator';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@CustomRepository(Project)
export class ProjectRepository extends Repository<Project> {
  async createProject(createProjectDto: CreateProjectDto): Promise<void> {
    const newProject = await this.save(createProjectDto);
    await this.save(newProject);
  }

  async findAllProjects(): Promise<Project[] | null> {
    const projects = await this.find();
    return projects;
  }

  async findProjectById(id: number): Promise<Project | null> {
    const project = await this.findOne({ where: { id } });
    return project;
  }

  async updateProject(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<void> {
    await this.update(id, updateProjectDto);
  }
}
