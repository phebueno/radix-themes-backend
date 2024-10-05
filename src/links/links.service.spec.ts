import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LinksService } from './links.service';
import { Link } from './link.entity';
import { Repository } from 'typeorm';
import { ArticleDto } from '../../src/news/dtos/article-dto';
import { mockArticleDto } from '../news/mocks/news.mock';
import { parse } from 'date-fns';
import { NotFoundException } from '@nestjs/common';
import { linksMock } from './mocks/links.mock';

describe('LinksService', () => {
  let service: LinksService;
  let linkRepository: Repository<Link>;

  const mockLinkRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinksService,
        {
          provide: getRepositoryToken(Link),
          useValue: mockLinkRepository,
        },
      ],
    }).compile();

    service = module.get<LinksService>(LinksService);
    linkRepository = module.get<Repository<Link>>(getRepositoryToken(Link));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createLinksForTheme', () => {
    it('should create and save links for the given theme', async () => {
      const themeId = '1';
      const articles: ArticleDto[] = [mockArticleDto, mockArticleDto];

      const linkEntities = articles.map((article) => ({
        link: article.url,
        theme: { id: themeId },
        imgUrl: article.socialimage,
        title: article.title,
        publishedDate:
          parse(article.seendate, "yyyyMMdd'T'HHmmssX", new Date()) || null,
        sourceCountry: article.sourcecountry,
      }));

      mockLinkRepository.create.mockReturnValue(linkEntities);
      mockLinkRepository.save.mockResolvedValue(linkEntities);

      await service.createLinksForTheme(themeId, articles);

      expect(mockLinkRepository.create).toHaveBeenCalledTimes(
        linkEntities.length,
      );

      //one for each item in array
      linkEntities.forEach((linkEntity) => {
        expect(mockLinkRepository.create).toHaveBeenCalledWith(linkEntity);
      });
      expect(mockLinkRepository.save).toHaveBeenCalledWith([
        linkEntities,
        linkEntities,
      ]);
    });
  });

  describe('findLinksByThemeId', () => {
    it('should return links and metadata when links exist for the given theme ID', async () => {
      const themeId = '1';
      const page = 1;
      const limit = 10;
      const mockLinks = [
        { id: '1', ...linksMock[0] },
        { id: '2', ...linksMock[1] },
      ] as Link[];
      const total = mockLinks.length;

      mockLinkRepository.findAndCount.mockResolvedValue([mockLinks, total]);

      const result = await service.findLinksByThemeId(themeId, page, limit);

      expect(result.links).toEqual(mockLinks);
      expect(result.meta.total).toBe(total);
      expect(result.meta.hasMore).toBe(false);
    });

    it('should throw NotFoundException when no links exist for the given theme ID', async () => {
      const themeId = '1';
      const page = 1;
      const limit = 10;
      const total = 0;

      mockLinkRepository.findAndCount.mockResolvedValue([[], total]);

      await expect(
        service.findLinksByThemeId(themeId, page, limit),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.findLinksByThemeId(themeId, page, limit),
      ).rejects.toThrow(`No news links found for theme of ID ${themeId}`);
    });
  });
});
