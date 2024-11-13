import { AxiosRequestConfig } from 'axios';
import * as path from 'path';
import { MediaType } from 'src/types/anilist';
import { Manga, SourceManga } from 'src/types/data';
import { RequireAtLeastOne } from 'src/types/utils';
import { readFile, writeFile } from 'src/utils';
import AnilistMergeScraper from './AnilistMergeScraper';
import Scraper from './Scraper';

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
export default abstract class MangaScraper extends Scraper<SourceManga> {
  /**
   * Định danh loại dữ liệu media là Manga.
   * @type {MediaType.Manga}
   */
  type: MediaType.Manga;

  private anilistMergeScraper: AnilistMergeScraper;

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
    this.anilistMergeScraper = new AnilistMergeScraper();
  }

  async scrapeAllMangaPages() {
    const data = await this.scrapeAllPages();
    writeFile(
      `./data/${this.id}.json`,
      JSON.stringify(data, null, 2),
      path.resolve(process.cwd(), './'),
    );
    return data;
  }

  /**
   * Lấy dữ liệu từ anilist sau đó hợp nhất với dữ liệu từ nguồn
   * @param nguồn nguồn manga
   * @returns nguồn manga đã hợp nhất
   */
  async scrapeAnilist(sources: SourceManga[]): Promise<Manga[]> {
    const fullSources: Manga[] = [];
    if (!sources) {
      sources = JSON.parse(
        readFile(`./data/${this.id}.json`, path.resolve(process.cwd(), './')),
      );
    }
    if (!sources?.length) {
      throw new Error('No sources');
    }
    for (const source of sources) {
      if (!source?.titles?.length) continue;
      let anilistId: number;
      if (source.anilistId) {
        anilistId = source.anilistId;
      } else {
        anilistId = await this.anilistMergeScraper.getRetriesId(
          source.titles,
          this.type,
        );
      }

      fullSources.push(
        this.anilistMergeScraper.mergeMangaInfo(source, anilistId),
      );
    }
    try {
      writeFile(
        `./data/${this.id}-full.json`,
        JSON.stringify(fullSources, null, 2),
        path.resolve(process.cwd(), './'),
      );
    } catch (error) {}
    return fullSources;
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
