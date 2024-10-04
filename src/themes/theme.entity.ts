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
import { Length } from 'class-validator';

@Entity('themes')
export class Theme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Length(3)
  title: string;

  @Column({ type: 'text', nullable: true })
  keywords: string;

  @Column({
    type: 'enum',
    enum: ThemeStatus,
    default: ThemeStatus.PENDING,
  })
  status: ThemeStatus;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @OneToMany(() => Link, link => link.theme)
  links: Link[];
}
