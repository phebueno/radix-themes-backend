import { Test, TestingModule } from '@nestjs/testing';
import { ThemesService } from './themes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Theme } from './theme.entity';
import { LinksService } from '../links/links.service';
import { CreateThemeDto } from './dtos/create-theme.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ThemeStatus } from './enums/theme-status.enum';
import { Link } from '../links/link.entity';
import { linksMock } from '../links/mocks/links.mock';
import { UpdateThemeDto } from './dtos/update-theme.dto';
import { themesMock } from './mocks/themes.mock';
import { NewsService } from '../news/news.service';
import { ArticleDto } from '../news/dtos/article-dto';
import { mockArticleDto } from '../news/mocks/news.mock';

const mockThemeRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  preload: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
};

const mockNewsService = {
  fetchNewsFromAPI: jest.fn(),
};

const mockLinksService = {
  createLinksForTheme: jest.fn(),
  findLinksByThemeId: jest.fn(),
};

describe('ThemesService', () => {
  let service: ThemesService;
  let themeRepository: Repository<Theme>;
  let newsService: NewsService;
  let linksService: LinksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThemesService,
        {
          provide: getRepositoryToken(Theme),
          useValue: mockThemeRepository,
        },
        {
          provide: NewsService,
          useValue: mockNewsService,
        },
        {
          provide: LinksService,
          useValue: mockLinksService,
        },
      ],
    }).compile();

    service = module.get<ThemesService>(ThemesService);
    themeRepository = module.get<Repository<Theme>>(getRepositoryToken(Theme));
    newsService = module.get<NewsService>(NewsService);
    linksService = module.get<LinksService>(LinksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new theme', async () => {
      const createThemeDto: CreateThemeDto = {
        title: 'New Theme',
        keywords: 'NestJS',
      };

      mockThemeRepository.create.mockReturnValue(createThemeDto);
      mockThemeRepository.save.mockResolvedValue({
        id: '1',
        ...createThemeDto,
      });

      const result = await service.create(createThemeDto);

      expect(themeRepository.create).toHaveBeenCalledWith(createThemeDto);
      expect(themeRepository.save).toHaveBeenCalledWith(createThemeDto);
      expect(result).toEqual({ id: '1', ...createThemeDto });
    });
  });

  describe('findAll', () => {
    it('should return themes with pagination', async () => {
      const page = 1;
      const limit = 10;
      const offset = 0;      

      const total = themesMock.length;

      mockThemeRepository.findAndCount.mockResolvedValue([themesMock, total]);

      const result = await service.findAll(page, limit, offset);

      expect(result).toEqual({
        themes: themesMock,
        meta: {
          total,
          hasMore: false,
        },
      });

      expect(mockThemeRepository.findAndCount).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
        skip: offset + (page - 1) * limit,
        take: limit,
      });
    });

    it('should return hasMore true if there are more themes', async () => {
      const page = 1;
      const limit = 1;
      const offset = 0;

      const mockThemes = [
        {
          id: '1',
          title: 'Theme 1',
          keywords: 'keyword1',
          status: ThemeStatus.PENDING,
        },
      ];
      const total = 2;

      mockThemeRepository.findAndCount.mockResolvedValue([mockThemes, total]);

      const result = await service.findAll(page, limit, offset);

      expect(result).toEqual({
        themes: mockThemes,
        meta: {
          total,
          hasMore: true,
        },
      });
    });
  });

  describe('findOneById', () => {
    it('should throw a NotFoundException if theme not found', async () => {
      mockThemeRepository.findOne.mockResolvedValue(null);
      await expect(service.findOneById('1', 1, 10)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return the theme with its links', async () => {
      const theme = { id: '1', title: 'Test Theme', keywords: 'test' } as Theme;
      const links = linksMock as Link[];
      const meta = { total: 1, hasMore: false };

      mockThemeRepository.findOne.mockResolvedValue(theme);
      mockLinksService.findLinksByThemeId.mockResolvedValue({ links, meta });

      const result = await service.findOneById('1', 1, 10);

      expect(result).toEqual({
        theme: { ...theme, links },
        meta,
      });
    });
  });

  describe('update', () => {
    it('should update the theme and return it', async () => {
      const themeId = '1';
      const updateThemeDto: UpdateThemeDto = {
        title: 'Updated Title',
        keywords: 'some key words',
      };
      const existingTheme = { id: themeId, ...updateThemeDto };

      mockThemeRepository.preload.mockResolvedValue(existingTheme);
      mockThemeRepository.save.mockResolvedValue(existingTheme);

      const result = await service.update(themeId, updateThemeDto);

      expect(mockThemeRepository.preload).toHaveBeenCalledWith({
        id: themeId,
        ...updateThemeDto,
      });
      expect(mockThemeRepository.save).toHaveBeenCalledWith(existingTheme);
      expect(result).toEqual(existingTheme);
    });

    it('should throw NotFoundException if the theme does not exist', async () => {
      const themeId = '1';
      const updateThemeDto: UpdateThemeDto = {
        title: 'Updated Title',
        keywords: 'some key words',
      };

      mockThemeRepository.preload.mockResolvedValue(null);

      await expect(service.update(themeId, updateThemeDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(themeId, updateThemeDto)).rejects.toThrow(
        `Theme with ID ${themeId} not found`,
      );
    });
  });

  describe('delete', () => {
    it('should delete the theme if it exists', async () => {
      mockThemeRepository.delete.mockResolvedValue({ affected: 1 });
      await service.delete('1');
      expect(themeRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if theme is not found', async () => {
      mockThemeRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.delete('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('searchNews', () => {
    it('should call NewsService and LinksService, and update theme status to COMPLETED', async () => {
      const themeId = '1';
      const existingTheme = {
        id: themeId,
        title: 'Test Theme',
        keywords: 'test, keywords',
        status: ThemeStatus.PENDING,
      };

      const mockArticles: ArticleDto[] = [
        mockArticleDto,
      ];

      mockThemeRepository.findOne.mockResolvedValue(existingTheme);
      mockNewsService.fetchNewsFromAPI.mockResolvedValue(mockArticles);
      mockLinksService.createLinksForTheme.mockResolvedValue(undefined);

      mockThemeRepository.update.mockResolvedValue(undefined);

      await service.searchNews(themeId);

      expect(mockThemeRepository.update).toHaveBeenCalledWith(themeId, {
        status: ThemeStatus.IN_PROGRESS,
      });
      expect(mockNewsService.fetchNewsFromAPI).toHaveBeenCalledWith(existingTheme);
      expect(mockLinksService.createLinksForTheme).toHaveBeenCalledWith(themeId, mockArticles);
      expect(mockThemeRepository.update).toHaveBeenCalledWith(themeId, {
        status: ThemeStatus.COMPLETED,
      });
    });

    it('should throw NotFoundException if the theme does not exist', async () => {
      const themeId = '1';
      mockThemeRepository.findOne.mockResolvedValue(null);

      await expect(service.searchNews(themeId)).rejects.toThrow(
        new NotFoundException(`Theme with ID ${themeId} not found`),
      );
    });

    it('should throw ForbiddenException if the theme status is COMPLETED', async () => {
      const themeId = '1';
      const existingTheme = {
        id: themeId,
        status: ThemeStatus.COMPLETED,
      };

      mockThemeRepository.findOne.mockResolvedValue(existingTheme);

      await expect(service.searchNews(themeId)).rejects.toThrow(
        new ForbiddenException(
          `News search on theme with ID ${themeId} is already completed`,
        ),
      );
    });

    it('should revert theme status to PENDING if there is an error', async () => {
      const themeId = '1';
      const existingTheme = {
        id: themeId,
        title: 'Test Theme',
        keywords: 'test, keywords',
        status: ThemeStatus.PENDING,
      };

      mockThemeRepository.findOne.mockResolvedValue(existingTheme);
      mockNewsService.fetchNewsFromAPI.mockRejectedValue(new Error('API Error'));
      mockThemeRepository.update.mockResolvedValue(undefined);

      await expect(service.searchNews(themeId)).rejects.toThrow('Error fetching news.');

      expect(mockThemeRepository.update).toHaveBeenCalledWith(themeId, {
        status: ThemeStatus.IN_PROGRESS,
      });
      expect(mockThemeRepository.update).toHaveBeenCalledWith(themeId, {
        status: ThemeStatus.PENDING,
      });
    });
  });

  describe('updateThemeStatus', () => {
    it('should update the status of a theme', async () => {
      const themeId = '1';
      const status = ThemeStatus.IN_PROGRESS;

      await service['updateThemeStatus'](themeId, status);

      expect(mockThemeRepository.update).toHaveBeenCalledWith(themeId, { status });
    });
  });
});
