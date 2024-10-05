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
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { Theme } from './theme.entity';
import { ThemesService } from './themes.service';
import { CreateThemeDto } from './dtos/create-theme.dto';
import { UpdateThemeDto } from './dtos/update-theme.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  limitQuerySchema,
  offsetQuerySchema,
  pageQuerySchema,
  paramSchema,
} from '../swagger/theme.swagger';
import { ApiSearchNewsResponses } from '../swagger/theme.decorator';
import { PaginationRequestDto, PaginationRequestWithOffsetDto, PaginationTransformPipe } from './dtos/pagination-request.dto';

@ApiTags('themes')
@Controller('themes')
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a theme.' })
  @ApiBody({ type: CreateThemeDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Theme created.' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Title or keywords under 3 characters or not strings',
  })
  createTheme(@Body(new ValidationPipe()) createThemeDto: CreateThemeDto): Promise<Theme> {
    return this.themesService.create(createThemeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all themes.' })
  @ApiQuery(pageQuerySchema)
  @ApiQuery(limitQuerySchema)
  @ApiQuery(offsetQuerySchema)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all themes with pagination.',
  })
  findAllThemes(
    @Query(PaginationTransformPipe) query: PaginationRequestWithOffsetDto
  ): Promise<{ themes: Theme[]; meta: { total: number; hasMore: boolean } }> {
    return this.themesService.findAll(query.page, query.limit, query.offset);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Return a single theme and its links.' })
  @ApiParam(paramSchema)
  @ApiQuery(pageQuerySchema)
  @ApiQuery(limitQuerySchema)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return a single theme and its links with pagination.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Either theme doesn't exist or it has no links",
  })
  async getThemeById(
    @Param('id', ParseUUIDPipe) id: string,
    @Query(PaginationTransformPipe) query: PaginationRequestDto
  ) {
    const newsLinks = await this.themesService.findOneById(id, query.page, query.limit);

    return newsLinks;
  }

  @Get(':id/search-news/')
  @ApiOperation({
    summary:
      "Triggers news search for a single theme using gdeltproject's API.",
  })
  @ApiParam(paramSchema)
  @ApiSearchNewsResponses()
  async searchNewsForTheme(@Param('id', ParseUUIDPipe) id: string) {
    await this.themesService.searchNews(id);

    return { message: 'Links created successfully.' };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a theme.' })
  @ApiBody({ type: UpdateThemeDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Theme updated.' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Title or keywords under 3 characters or not strings',
  })
  updateTheme(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateThemeDto: UpdateThemeDto,
  ): Promise<Theme> {
    return this.themesService.update(id, updateThemeDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary:
      "Deletes a single theme",
  })
  @ApiParam(paramSchema)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Theme removed.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Theme not found.",
  })
  deleteTheme(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.themesService.delete(id);
  }
}
