import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Theme } from './theme.entity';
import { Link } from '../links/link.entity';

import { CreateThemeDto } from './dtos/create-theme.dto';
import { UpdateThemeDto } from './dtos/update-theme.dto';

import { ArticleDto } from '../links/dtos/article-dto';
import { LinksService } from '../links/links.service';
import { ThemeStatus } from './enums/theme-status.enum';

import axios from 'axios';

@Injectable()
export class ThemesService {
  constructor(
    @InjectRepository(Theme)
    private themeRepository: Repository<Theme>,
    private readonly linksService: LinksService,
  ) {}

  async create(createThemeDto: CreateThemeDto): Promise<Theme> {
    const theme = this.themeRepository.create(createThemeDto);
    return this.themeRepository.save(theme);
  }

  async findAll(): Promise<Theme[]> {
    return this.themeRepository.find({
      relations: ['links'],
      order: {
        createdAt: 'DESC',
      },
    });
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

  private async updateThemeStatus(
    themeId: string,
    status: ThemeStatus,
  ): Promise<void> {
    await this.themeRepository.update(themeId, { status });
  }

  private cleanKeywords = (keywords: string): string => {
    return keywords
      .split(' ') // Quebra o texto em palavras (assume que as palavras estão separadas por espaços)
      .filter((word) => word.length >= 3) // Filtra palavras com menos de 3 caracteres
      .join(' OR '); // Junta as palavras restantes com "OR" entre elas
  };

  private async fetchNewsFromAPI(theme: Theme): Promise<ArticleDto[]> {
    const query = `${theme.title} AND ${this.cleanKeywords(theme.keywords)}`;
    const result = await axios.get(
      `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&format=json`,
    );
    if (!result.data.articles) {
      //will fail if any query word is too short, too long or no results are found
      throw new InternalServerErrorException(
        'Something went wrong with gdeltproject request. Please try rewriting your queries before trying again.',
      );
    }

    const articles = result.data.articles as ArticleDto[];

    return articles;
  }

  async searchNews(themeId: string): Promise<Link[]> {
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
      const newsLinks = await this.fetchNewsFromAPI(existingTheme);

      const mappedLinks = await this.linksService.createLinksForTheme(
        themeId,
        newsLinks,
      );

      await this.updateThemeStatus(themeId, ThemeStatus.COMPLETED);

      return mappedLinks;
    } catch (error) {
      console.log(error);
      await this.updateThemeStatus(themeId, ThemeStatus.PENDING);

      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new Error('Error fetching news.');
    }
  }
}
