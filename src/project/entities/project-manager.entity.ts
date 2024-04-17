import {
  BaseEntity,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  Index,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Project } from './project.entity';

@Index(['projectId', 'userId'], { unique: true })
@Entity()
export class ProjectManager extends BaseEntity {
  @PrimaryColumn()
  projectId: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User, (user) => user.projectManagers)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
