import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ThemesService } from './themes.service';
import { LinksService } from '../links/links.service';
import { CreateThemeDto } from './dtos/create-theme.dto';
import { UpdateThemeDto } from './dtos/update-theme.dto';
import { Theme } from './theme.entity';

@Controller('themes')
export class ThemesController {
  constructor(
    private readonly themesService: ThemesService,
    private readonly linksService: LinksService,
  ) {}

  @Post()
  createTheme(@Body() createThemeDto: CreateThemeDto): Promise<Theme> {
    return this.themesService.create(createThemeDto);
  }

  @Get()
  findAllThemes(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Theme[]> {
    return this.themesService.findAll(page, limit);
  }

  @Get(':id')
  async getThemeById(@Param('id', ParseUUIDPipe) id: string) {
    const newsLinks = await this.themesService.findOneById(id);

    return { message: 'Links created successfully.', newsLinks };
  }

  @Get(':id/search-news/')
  async searchNewsForTheme(@Param('id', ParseUUIDPipe) id: string) {
    const newsLinks = await this.themesService.searchNews(id);

    return { message: 'Links created successfully.', newsLinks };
  }

  @Put(':id')
  updateTheme(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateThemeDto: UpdateThemeDto,
  ): Promise<Theme> {
    return this.themesService.update(id, updateThemeDto);
  }

  @Delete(':id')
  deleteTheme(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.themesService.delete(id);
  }
}
