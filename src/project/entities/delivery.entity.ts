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
export class Delivery extends BaseEntity {
  @PrimaryColumn()
  projectId: number;

  @Column()
  deliveryDate: Date;

  @Column()
  unit: string;

  @Column()
  totalDeliveryCount: number;

  @Column()
  deliveryCount: number;

  @Column()
  productionCount: number;

  @OneToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
