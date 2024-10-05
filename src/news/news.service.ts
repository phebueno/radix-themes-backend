import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Theme } from '../themes/theme.entity';
import { ArticleDto } from './dtos/article-dto';
import axios from 'axios';

@Injectable()
export class NewsService {
  private cleanKeywords(keywords: string): string {
    return keywords
      .split(' ')
      .filter((word) => word.length >= 3)
      .join(' OR ');
  }
  async fetchNewsFromAPI(theme: Theme): Promise<ArticleDto[]> {
    const query = `${theme.title} AND ${this.cleanKeywords(theme.keywords)}`;
    const result = await axios.get(
      `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&format=json`,
    );
    if (!result.data.articles) {
      //will fail if any query word is too short, too long or no results are found
      throw new InternalServerErrorException(
        'Something went wrong with gdeltproject request. Please try rewriting your queries before trying again.',
      );
    }

    const articles = result.data.articles as ArticleDto[];

    return articles;
  }
}
