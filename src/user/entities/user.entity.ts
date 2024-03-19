import { Project } from 'src/project/entities/project.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  picture?: string;

  @Column({ nullable: true })
  position?: string;

  @Column({ nullable: true })
  team?: number;

  @OneToMany(() => Project, (project) => project.manager)
  projects: Project[];
}
