import { Project } from 'src/project/entities/project.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Role } from '../enum/roles.enum';
import { Team } from './team.entity';
import { ProjectManager } from 'src/project/entities/project-manager.entity';
import { UserStatus } from '../enum/status.enum';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  picture?: string;

  @Column({ nullable: true })
  role?: Role;

  @Column({ nullable: true })
  team?: string;

  @Column({
    type: 'enum',
    nullable: true,
    default: 'pending',
    enum: UserStatus,
  })
  status: UserStatus;

  @Column({ nullable: true })
  currentRefreshToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  currentRefreshTokenExp: Date;

  @Column({ type: 'varchar', nullable: true })
  effectiveDate: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Project, (project) => project.managers)
  projects: Project[];

  @OneToMany(() => Team, (team) => team.tm)
  teams: Team[];

  @OneToMany(() => ProjectManager, (ProjectManager) => ProjectManager.user)
  projectManagers: ProjectManager[];
}
