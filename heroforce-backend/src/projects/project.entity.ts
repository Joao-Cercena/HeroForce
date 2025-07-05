import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ 
    type: 'enum', 
    enum: ['pendente', 'emandamento', 'concluido'],
    default: 'pendente'
  })
  status: string;

  @Column({ type: 'int', default: 0 })
  progress: number;

  @Column({ type: 'jsonb' })
  metrics: {
    agility: number;
    enchantment: number;
    efficiency: number;
    excellence: number;
    transparency: number;
    ambition: number;
  };

  @ManyToOne(() => User, user => user.projects)
  hero: User;
}