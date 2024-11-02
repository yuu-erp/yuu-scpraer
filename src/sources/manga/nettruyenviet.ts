import MangaScraper, {
  GetImagesQuery,
  ImageSource,
} from 'src/core/MangaScraper';
import { SourceManga } from 'src/types/data';

export default class MangaNettruyenScraper extends MangaScraper {
  constructor() {
    super('nettruyenviet', 'Nettruyenviet', {
      baseURL: 'https://nettruyenviet.com',
    });
  }

  async scrapePage(page: number): Promise<SourceManga[]> {
    console.log('scrapePage - page: ', page);
    return [this.scrapeManga('sourceId')];
  }

  async scrapeManga(sourceId: string): Promise<SourceManga> {
    console.log('scrapeManga - sourceId: ', sourceId);
    return;
  }

  async getImages(_ids: GetImagesQuery): Promise<ImageSource[]> {
    return;
  }
}
