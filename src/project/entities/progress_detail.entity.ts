import {
  BaseEntity,
  Column,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Project } from './project.entity';

export class ProgressDetail extends BaseEntity {
  @PrimaryColumn()
  projectId: number;

  @Column()
  internalKickOff: Boolean;

  //   `internal_kickoff` BOOLEAN,
  //   `client_kickoff` BOOLEAN,
  //   `cost_sharing` BOOLEAN,
  //   `legal_issues_review` BOOLEAN,
  //   `recruitment` BOOLEAN,
  //   `delivery_complete` BOOLEAN,
  //   `inspection_confirmation` BOOLEAN,
  //   `delivery_inspection_report` BOOLEAN,
  //   `closure_report` BOOLEAN

  //   @Column()
  //   @Column()
  //   @Column()
  //   @Column()
  @OneToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
