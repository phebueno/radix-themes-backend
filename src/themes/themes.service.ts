import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Theme } from './theme.entity';
import { CreateThemeDto } from './dtos/create-theme.dto';
import { UpdateThemeDto } from './dtos/update-theme.dto';
import { LinksService } from '../links/links.service';
import { ThemeStatus } from './enums/theme-status.enum';

@Injectable()
export class ThemesService {
  constructor(
    @InjectRepository(Theme)
    private themeRepository: Repository<Theme>,
    private readonly linksService: LinksService
  ) {}

  async create(createThemeDto: CreateThemeDto): Promise<Theme> {
    const theme = this.themeRepository.create(createThemeDto);
    return this.themeRepository.save(theme);
  }

  async findAll(): Promise<Theme[]> {
    return this.themeRepository.find();
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

  private async updateThemeStatus(themeId: string, status: ThemeStatus): Promise<void> {
    await this.themeRepository.update(themeId, { status });
  }

  private async fetchNewsFromAPI(): Promise<string[]> {
    // Aqui você implementaria a chamada real para a API externa
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          'https://example.com/1',
          'https://example.com/2',
        ]);
      }, 3000);
    });
  }
  
  async searchNews(themeId: string): Promise<string[]> {
    await this.updateThemeStatus(themeId, ThemeStatus.IN_PROGRESS);

    try {
      const newsLinks = await this.fetchNewsFromAPI();

      await this.linksService.createLinksForTheme(themeId, newsLinks);

      await this.updateThemeStatus(themeId, ThemeStatus.COMPLETED);

      return newsLinks;

    } catch (error) {
      await this.updateThemeStatus(themeId, ThemeStatus.PENDING);
      throw new Error('Error fetching news.');
    }
  }
}
