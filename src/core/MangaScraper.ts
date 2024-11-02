import { AxiosRequestConfig } from 'axios';
import { MediaType } from 'src/types/anilist';
import { RequireAtLeastOne } from 'src/types/utils';
import Scraper from './Scraper';
import { SourceManga } from 'src/types/data';

export type ImageSource = {
  image: string;
  useProxy?: boolean;
};

export type GetImagesQuery = {
  source_id: string;
  source_media_id: string;
  chapter_id: string;
};

/**
 * Lớp MangaScraper đại diện cho bộ cào dữ liệu manga.
 * Kế thừa từ lớp Scraper, lớp này định nghĩa các phương thức để thu thập thông tin về manga.
 *
 * @abstract
 * @extends {Scraper}
 */
export default abstract class MangaScraper extends Scraper {
  /**
   * Định danh loại dữ liệu media là Manga.
   * @type {MediaType.Manga}
   */
  type: MediaType.Manga;

  /**
   * Tạo một đối tượng MangaScraper.
   *
   * @param {string} id - ID của nguồn manga.
   * @param {string} name - Tên của nguồn manga.
   * @param {RequireAtLeastOne<AxiosRequestConfig, 'baseURL'>} axiosConfig - Cấu hình cho axios, yêu cầu phải có baseURL.
   */
  constructor(
    id: string,
    name: string,
    axiosConfig: RequireAtLeastOne<AxiosRequestConfig, 'baseURL'>,
  ) {
    super(id, name, axiosConfig);
  }

  async scrapeAllMangaPages() {
    const data = await this.scrapeAllPages();
    return data;
  }

  /**
   * Phương thức trừu tượng để cào thông tin chi tiết về một manga từ nguồn.
   * Phương thức này phải được thực thi trong các lớp con.
   *
   * @abstract
   * @param {string} _sourceId - ID của nguồn manga.
   * @returns {Promise<SourceManga>} - Trả về một Promise chứa thông tin của manga.
   */
  abstract scrapeManga(_sourceId: string): Promise<SourceManga>;

  /**
   * Phương thức trừu tượng để lấy danh sách hình ảnh của một chương từ nguồn.
   * Phương thức này phải được thực thi trong các lớp con.
   *
   * @abstract
   * @param {GetImagesQuery} _ids - Tham số truy vấn để xác định nguồn, ID của manga và chương truyện.
   * @returns {Promise<ImageSource[]>} - Trả về một Promise chứa danh sách hình ảnh.
   */
  abstract getImages(_ids: GetImagesQuery): Promise<ImageSource[]>;
}
