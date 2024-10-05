import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Theme } from './theme.entity';
import { ThemeStatus } from './enums/theme-status.enum';

import { CreateThemeDto } from './dtos/create-theme.dto';
import { UpdateThemeDto } from './dtos/update-theme.dto';

import { LinksService } from '../links/links.service';
import { NewsService } from '../news/news.service';


@Injectable()
export class ThemesService {
  constructor(
    @InjectRepository(Theme)
    private readonly themeRepository: Repository<Theme>,
    private readonly newsService: NewsService,
    private readonly linksService: LinksService,
  ) {}
  private async updateThemeStatus(
    themeId: string,
    status: ThemeStatus,
  ): Promise<void> {
    await this.themeRepository.update(themeId, { status });
  }  

  async searchNews(themeId: string): Promise<void> {
    const existingTheme = await this.themeRepository.findOne({
      where: { id: themeId },
    });

    if (!existingTheme) {
      throw new NotFoundException(`Theme with ID ${themeId} not found`);
    }

    if (existingTheme.status === ThemeStatus.COMPLETED) {
      throw new ForbiddenException(
        `News search on theme with ID ${themeId} is already completed`,
      );
    }

    await this.updateThemeStatus(themeId, ThemeStatus.IN_PROGRESS);

    try {
      const newsLinks = await this.newsService.fetchNewsFromAPI(existingTheme);

      await this.linksService.createLinksForTheme(themeId, newsLinks);

      await this.updateThemeStatus(themeId, ThemeStatus.COMPLETED);
    } catch (error) {
      console.log(error);
      await this.updateThemeStatus(themeId, ThemeStatus.PENDING);

      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new Error('Error fetching news.');
    }
  }

  async create(createThemeDto: CreateThemeDto): Promise<Theme> {
    const theme = this.themeRepository.create(createThemeDto);
    return this.themeRepository.save(theme);
  }

  async findAll(
    page: number,
    limit: number,
    offset: number,
  ): Promise<{ themes: Theme[]; meta: { total: number; hasMore: boolean } }> {
    const [themes, total] = await this.themeRepository.findAndCount({
      order: {
        createdAt: 'DESC',
      },
      skip: offset + (page - 1) * limit,
      take: limit,
    });

    const hasMore = total > (page - 1) * limit + themes.length;

    return { themes, meta: { total, hasMore } };
  }

  async findOneById(
    id: string,
    page: number,
    limit: number,
  ): Promise<{
    theme: Theme;
    meta: { total: number; hasMore: boolean };
  }> {
    const theme = await this.themeRepository.findOne({
      where: { id },
    });

    if (!theme) {
      throw new NotFoundException(`Theme of ID ${id} not found`);
    }

    const { links, meta } = await this.linksService.findLinksByThemeId(
      id,
      page,
      limit,
    );

    return { theme: { ...theme, links }, meta };
  }

  async update(id: string, updateThemeDto: UpdateThemeDto): Promise<Theme> {
    const theme = await this.themeRepository.preload({
      id,
      ...updateThemeDto,
    });
    if (!theme) {
      throw new NotFoundException(`Theme with ID ${id} not found`);
    }
    return this.themeRepository.save(theme);
  }

  async delete(id: string): Promise<void> {
    const result = await this.themeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Theme with ID ${id} not found`);
    }
  }
}
