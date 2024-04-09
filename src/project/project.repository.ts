import { Repository } from 'typeorm';
import { CustomRepository } from 'src/common/decorators/typeorm-repository.decorator';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@CustomRepository(Project)
export class ProjectRepository extends Repository<Project> {
  async createProject(createProjectDto: CreateProjectDto) {
    const newProject = await this.create(createProjectDto);
    return await this.save(newProject);
  }

  async findAllProjects(): Promise<Project[] | null> {
    const projects = await this.find();
    return projects;
  }

  async findProjectById(id: number): Promise<Project | null> {
    const project = await this.findOne({ where: { id } });
    return project;
  }

  async updateProject(id: number, updateProjectDto: UpdateProjectDto) {
    return await this.update(id, updateProjectDto);
  }

  async removeProject(id: number) {
    return await this.delete(id);
  }
}
