import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('team')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  team: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'TM' })
  tm: User;
}
