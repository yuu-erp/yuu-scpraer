import MangaScraper, {
  GetImagesQuery,
  ImageSource,
} from 'src/core/MangaScraper';
import { SourceChapter, SourceManga } from 'src/types/data';
import * as cheerio from 'cheerio';
import { fulfilledPromises } from 'src/utils';
import logger from 'src/lib/logger';

export default class MangaNettruyenScraper extends MangaScraper {
  constructor() {
    super('nettruyenviet', 'Nettruyenviet', {
      baseURL: 'https://nettruyenviet.com',
    });
  }

  async scrapePage(page: number): Promise<SourceManga[]> {
    try {
      const { data } = await this.client.get('/?page=' + page);
      const $ = cheerio.load(data);
      const mangaList = $('.items .item');
      return fulfilledPromises(
        mangaList.toArray().map((el) => {
          const manga = $(el);
          const slug = this.urlToSourceId(manga.find('a').attr('href'));
          return this.scrapeManga(slug);
        }),
      );
    } catch (error) {
      logger.error(error);
    }
  }

  async scrapeManga(sourceId: string): Promise<SourceManga> {
    const { data } = await this.client.get('/truyen-tranh/' + sourceId);
    const $ = cheerio.load(data);
    const mainTitle = $('.title-detail').text().trim();
    const altTitle = this.parseTitle($('.other-name').text().trim());
    const titles = [mainTitle, ...altTitle];
    const coverImage = $('.image-thumb').attr('src');
    const chapters: SourceChapter[] = $('.list-chapter div.chapter')
      .toArray()
      .map((el) => {
        const chapter = $(el).find('a');
        const chapterName = chapter.text().trim();
        const chapterSlug = chapter.attr('href');
        const chapter_id = chapter.data('id').toString();
        return {
          name: chapterName,
          sourceChapterId: chapter_id,
          sourceMediaId: sourceId,
          slug: this.urlToSourceId(chapterSlug),
        };
      });
    return {
      titles,
      coverImage,
      sourceId: this.id,
      sourceMediaId: sourceId,
      chapters,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getImages(_ids: GetImagesQuery): Promise<ImageSource[]> {
    return;
  }

  urlToSourceId(url: string) {
    const splitted = url.split('/');
    const slug = splitted[splitted.length - 1];
    return slug;
  }
}
