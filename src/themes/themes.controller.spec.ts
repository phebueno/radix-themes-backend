import { Test, TestingModule } from '@nestjs/testing';
import { ThemesController } from './themes.controller';
import { ThemesService } from './themes.service';
import { CreateThemeDto } from './dtos/create-theme.dto';
import { Theme } from './theme.entity';
import { themesMock } from './mocks/themes.mock';
import { ValidationPipe } from '@nestjs/common';

describe('ThemesController', () => {
  let themesController: ThemesController;
  let themesService: ThemesService;

  const mockThemesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    searchNews: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThemesController],
      providers: [
        {
          provide: ThemesService,
          useValue: mockThemesService,
        },
      ],
    }).compile();

    themesController = module.get<ThemesController>(ThemesController);
    themesService = module.get<ThemesService>(ThemesService);
  });

  describe('createTheme', () => {
    let pipe: ValidationPipe;
    beforeEach(() => {
      pipe = new ValidationPipe();
    });
    it('should create a theme and return it', async () => {
      const createThemeDto: CreateThemeDto = {
        title: themesMock[0].title,
        keywords: themesMock[0].keywords,
      };

      themesMock[0];

      jest
        .spyOn(themesService, 'create')
        .mockResolvedValue(themesMock[0] as Theme);

      expect(await themesController.createTheme(createThemeDto)).toBe(
        themesMock[0],
      );
      expect(themesService.create).toHaveBeenCalledWith(createThemeDto);
    });
  });

  describe('findAllThemes', () => {
    it('should return an array of themes', async () => {
      const mockResponse = {
        themes: themesMock,
        meta: {
          total: themesMock.length,
          hasMore: themesMock.length > 10,
        },
      };

      jest.spyOn(themesService, 'findAll').mockResolvedValue(
        mockResponse as {
          themes: Theme[];
          meta: { total: number; hasMore: boolean };
        },
      );

      expect(
        await themesController.findAllThemes({ page: 1, limit: 10, offset: 0 }),
      ).toBe(mockResponse);
      expect(themesService.findAll).toHaveBeenCalledWith(1, 10, 0);
    });
  });

  describe('getThemeById', () => {
    it('should return a theme by id', async () => {
      const mockResponse = {
        theme: themesMock[0],
        meta: {
          total: themesMock.length,
          hasMore: themesMock.length > 10,
        },
      };

      jest.spyOn(themesService, 'findOneById').mockResolvedValue(
        mockResponse as {
          theme: Theme;
          meta: { total: number; hasMore: boolean };
        },
      );

      expect(
        await themesController.getThemeById(themesMock[0].id, {
          page: 1,
          limit: 10,
        }),
      ).toBe(mockResponse);
      expect(themesService.findOneById).toHaveBeenCalledWith(
        themesMock[0].id,
        1,
        10,
      );
    });
  });

  describe('updateTheme', () => {
    it('should update a theme and return it', async () => {
      const id = '1';
      const updateThemeDto = {
        title: 'Updated Theme',
        keywords: 'keyword1,keyword2',
      };
      const result = { ...themesMock[0], ...updateThemeDto } as Theme;

      jest.spyOn(themesService, 'update').mockResolvedValue(result);

      expect(await themesController.updateTheme(id, updateThemeDto)).toBe(
        result,
      );
      expect(themesService.update).toHaveBeenCalledWith(id, updateThemeDto);
    });
  });

  describe('deleteTheme', () => {
    it('should delete a theme', async () => {
      const id = '1';

      jest.spyOn(themesService, 'delete').mockResolvedValue(undefined);

      await themesController.deleteTheme(id);
      expect(themesService.delete).toHaveBeenCalledWith(id);
    });
  });
});
