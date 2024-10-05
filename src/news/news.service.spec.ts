import { InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { NewsService } from './news.service';
import { ArticleDto } from './dtos/article-dto'; // ajuste conforme seu projeto
import { Theme } from '../themes/theme.entity'; // ajuste conforme seu projeto
import { mockArticleDto } from './mocks/news.mock';
import { themesMock } from '../themes/mocks/themes.mock';

jest.mock('axios');

describe('NewsService', () => {
  let service: NewsService;

  beforeEach(() => {
    service = new NewsService();
  });

  describe('fetchNewsFromAPI', () => {
    it('should return articles when API call is successful', async () => {
      const articles: ArticleDto[] = [mockArticleDto, mockArticleDto];

      (axios.get as jest.Mock).mockResolvedValue({
        data: { articles },
      });

      const result = await service.fetchNewsFromAPI(themesMock[0] as Theme);

      expect(result).toEqual(articles);
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('https://api.gdeltproject.org/api/v2/doc/doc'),
      );
    });

    it('should throw InternalServerErrorException when no articles are returned', async () => {
      (axios.get as jest.Mock).mockResolvedValue({
        data: {},
      });

      await expect(
        service.fetchNewsFromAPI(themesMock[0] as Theme),
      ).rejects.toThrow(InternalServerErrorException);
      await expect(
        service.fetchNewsFromAPI(themesMock[0] as Theme),
      ).rejects.toThrow(
        'Something went wrong with gdeltproject request. Please try rewriting your queries before trying again.',
      );
    });
  });
});
