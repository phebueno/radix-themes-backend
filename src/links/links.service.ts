import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './link.entity';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}

  async createLinksForTheme(themeId: string, links: string[]) {
    const linkEntities = links.map((link) => this.linkRepository.create({
      link,
      theme: { id: themeId },
    }));

    await this.linkRepository.save(linkEntities);
  }
}
