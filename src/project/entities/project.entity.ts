import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  manager_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  creation_stage: string;

  @Column({ type: 'varchar', length: 255 })
  project_id: string;

  @Column({ type: 'varchar', length: 255 })
  client: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  progress_stage: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  build_stage: string;

  @Column()
  slack_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  created_at: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  updated_at: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'manager_id' })
  manager: User;
}
