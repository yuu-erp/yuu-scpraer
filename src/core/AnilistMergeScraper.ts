import { AnilistService } from 'src/service/anilistService/anilist.service';
import { MediaType } from 'src/types/anilist';
import { isVietnamese } from 'src/utils';

export default class AnilistMergeScraper {
  private anilistService: AnilistService;
  constructor() {
    this.anilistService = new AnilistService();
  }

  async getRetriesId<T extends MediaType>(titles: string[], type: T) {
    for (const title of titles) {
      if (isVietnamese(title)) continue;
      const data = await this.anilistService.getIdByTitle(title, type);
      if (data) return data;
    }
    return null;
  }
}
