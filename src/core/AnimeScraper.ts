import { AxiosRequestConfig } from 'axios';
import { Scraper } from './Scraper';
import { RequireAtLeastOne } from 'src/types/utils';
import { MediaType } from 'src/types/anilist';

export default class AnimeScraper extends Scraper {
  type: MediaType.Anime;
  constructor(
    id: string,
    name: string,
    axiosConfig: RequireAtLeastOne<AxiosRequestConfig, 'baseURL'>,
  ) {
    super(id, name, axiosConfig);
  }
}
