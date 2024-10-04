import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Link } from './link.entity';

import { ArticleDto } from './dtos/article-dto';

import { parse } from 'date-fns';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}

  async createLinksForTheme(themeId: string, articles: ArticleDto[]) {
    const linkEntities = articles.map((article) =>
      this.linkRepository.create({
        link: article.url,
        theme: { id: themeId },
        imgUrl: article.socialimage,
        title: article.title,
        publishedDate: parse(article.seendate, "yyyyMMdd'T'HHmmssX", new Date()) || null,
        sourceCountry: article.sourcecountry,
      }),
    );


    await this.linkRepository.save(linkEntities);

    return linkEntities;
  }
}
