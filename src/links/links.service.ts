import { Injectable, NotFoundException } from '@nestjs/common';
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
        publishedDate:
          parse(article.seendate, "yyyyMMdd'T'HHmmssX", new Date()) || null,
        sourceCountry: article.sourcecountry,
      }),
    );

    await this.linkRepository.save(linkEntities);

    return linkEntities;
  }

  async findLinksByThemeId(
    themeId: string,
    page: number,
    limit: number,
  ): Promise<{ links: Link[]; meta: { total: number; hasMore: boolean } }> {
    const [links, total] = await this.linkRepository.findAndCount({
      where: { theme: { id: themeId } },
      order: { publishedDate: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    if (!total) {
      throw new NotFoundException(
        `No news links found for theme of ID ${themeId}`,
      );
    }

    const hasMore = total > page * limit;

    return { links, meta: { total, hasMore } };
  }
}
