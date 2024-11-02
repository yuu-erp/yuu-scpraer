import MangaScraper from 'src/core/MangaScraper';

export default class MangaNettruyenScraper extends MangaScraper {
  constructor() {
    super('nettruyenviet', 'Nettruyenviet', {
      baseURL: 'https://nettruyenviet.com',
    });
  }
}
