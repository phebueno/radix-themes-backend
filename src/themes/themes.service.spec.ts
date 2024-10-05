import { Test, TestingModule } from '@nestjs/testing';
import { ThemesService } from './themes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Theme } from './theme.entity';
import { LinksService } from '../links/links.service';
import { CreateThemeDto } from './dtos/create-theme.dto';
import { NotFoundException } from '@nestjs/common';

const mockThemeRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  preload: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
};

const mockLinksService = {
  createLinksForTheme: jest.fn(),
  findLinksByThemeId: jest.fn(),
};

describe('ThemesService', () => {
  let service: ThemesService;
  let themeRepository: Repository<Theme>;
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
          provide: LinksService,
          useValue: mockLinksService,
        },
      ],
    }).compile();

    service = module.get<ThemesService>(ThemesService);
    themeRepository = module.get<Repository<Theme>>(getRepositoryToken(Theme));
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

  describe('findOneById', () => {
    it('should throw a NotFoundException if theme not found', async () => {
      mockThemeRepository.findOne.mockResolvedValue(null);
      await expect(service.findOneById('1', 1, 10)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return the theme with its links', async () => {
      const theme = { id: '1', title: 'Test Theme', keywords: 'test' };
      const links = [{ id: '1', url: 'https://example.com' }];
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

  describe('delete', () => {
    it('should throw NotFoundException if theme is not found', async () => {
      mockThemeRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.delete('1')).rejects.toThrow(NotFoundException);
    });

    it('should delete the theme if it exists', async () => {
      mockThemeRepository.delete.mockResolvedValue({ affected: 1 });
      await service.delete('1');
      expect(themeRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});
