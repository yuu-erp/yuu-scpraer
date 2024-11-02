import { AxiosRequestConfig } from 'axios';
import { MediaType } from 'src/types/anilist';
import { RequireAtLeastOne } from 'src/types/utils';
import Scraper from './Scraper';

/**
 * Lớp AnimeScraper là lớp trừu tượng kế thừa từ lớp Scraper,
 * dùng để cào dữ liệu từ các nguồn anime.
 *
 * @abstract
 */
export default abstract class AnimeScraper extends Scraper {
  /** Kiểu của scraper, trong trường hợp này là anime */
  type: MediaType.Anime;

  /**
   * Tạo một đối tượng AnimeScraper với các tham số cấu hình.
   *
   * @param {string} id - ID của nguồn anime.
   * @param {string} name - Tên của nguồn anime.
   * @param {RequireAtLeastOne<AxiosRequestConfig, 'baseURL'>} axiosConfig - Cấu hình Axios, bắt buộc phải có `baseURL`.
   */
  constructor(
    id: string,
    name: string,
    axiosConfig: RequireAtLeastOne<AxiosRequestConfig, 'baseURL'>,
  ) {
    super(id, name, axiosConfig);
  }
}
