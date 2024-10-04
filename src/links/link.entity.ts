import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Theme } from '../themes/theme.entity';
import { Url } from 'url';

@Entity('links')
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  link: string;

  @Column({ nullable: true })
  imgUrl?: string;

  @Column()
  title: string;

  @Column({ nullable: true, type: 'timestamp', name: 'publishedDate' })
  publishedDate: Date | null;

  @Column()
  sourceCountry: string;

  @ManyToOne(() => Theme, (theme) => theme.links, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'themeId' })
  theme: Theme;
}
