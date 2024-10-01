import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Theme } from './theme.entity';
import { CreateThemeDto } from './dtos/create-theme.dto';
import { UpdateThemeDto } from './dtos/update-theme.dto';

@Injectable()
export class ThemesService {
  constructor(
    @InjectRepository(Theme)
    private themeRepository: Repository<Theme>,
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
}
