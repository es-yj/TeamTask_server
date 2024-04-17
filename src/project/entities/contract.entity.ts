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
  amount: number;

  @Column()
  projectForm: string;

  @Column()
  dataForm: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @OneToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
