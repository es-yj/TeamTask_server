import { Project } from 'src/project/entities/project.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../enum/roles.enum';

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
  team?: number;

  @Column({ nullable: true, default: 'pending' })
  status: string;

  @Column({ nullable: true })
  currentRefreshToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  currentRefreshTokenExp: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Project, (project) => project.manager)
  projects: Project[];
}
