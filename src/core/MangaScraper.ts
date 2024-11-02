import { AxiosRequestConfig } from 'axios';
import { Scraper } from './Scraper';
import { RequireAtLeastOne } from 'src/types/utils';
import { MediaType } from 'src/types/anilist';

export default class MangaScraper extends Scraper {
  type: MediaType.Manga;
  constructor(
    id: string,
    name: string,
    axiosConfig: RequireAtLeastOne<AxiosRequestConfig, 'baseURL'>,
  ) {
    super(id, name, axiosConfig);
  }
}
