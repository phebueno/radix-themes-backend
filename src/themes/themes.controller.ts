import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { CreateThemeDto } from './dtos/create-theme.dto';
import { UpdateThemeDto } from './dtos/update-theme.dto';
import { Theme } from './theme.entity';

@Controller('themes')
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Post()
  createTheme(@Body() createThemeDto: CreateThemeDto): Promise<Theme> {
    return this.themesService.create(createThemeDto);
  }

  @Get()
  findAllThemes(): Promise<Theme[]> {
    return this.themesService.findAll();
  }

  @Put(':id')
  updateTheme(
    @Param('id') id: string,
    @Body() updateThemeDto: UpdateThemeDto,
  ): Promise<Theme> {
    return this.themesService.update(id, updateThemeDto);
  }

  @Delete(':id')
  deleteTheme(@Param('id') id: string): Promise<void> {
    return this.themesService.delete(id);
  }
}
