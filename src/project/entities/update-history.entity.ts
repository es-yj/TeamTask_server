import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class UpdateHistory extends BaseEntity {
  @PrimaryColumn()
  projectId: number;

  @Column()
  updatedBy: string;

  @Column()
  updatedAt: Date;

  @OneToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
