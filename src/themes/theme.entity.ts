import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ThemeStatus } from './enums/theme-status.enum';
import { Link } from '../links/link.entity';

@Entity('themes')
export class Theme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  keywords: string;

  @Column({
    type: 'enum',
    enum: ThemeStatus,
    default: ThemeStatus.PENDING,
  })
  status: ThemeStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Link, link => link.theme)
  links: Link[];
}
