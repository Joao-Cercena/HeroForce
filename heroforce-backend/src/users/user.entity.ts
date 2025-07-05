import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Project } from '../projects/project.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  heroCharacter: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Project, project => project.hero)
  projects: Project[];
}