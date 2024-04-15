import {
  BaseEntity,
  Entity,
  JoinColumn,
  PrimaryColumn,
  OneToOne,
  Column,
} from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class Contract extends BaseEntity {
  @PrimaryColumn()
  projectId: number;

  @Column()
  period: string;

  @Column()
  amount: number;

  @Column()
  type: string;

  @OneToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
