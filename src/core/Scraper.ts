import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { errorLogger } from 'axios-logger';
import axiosRetry from 'axios-retry';
import logger from 'src/lib/logger';
import { RequireAtLeastOne } from 'src/types/utils';

export const DEFAULT_CONFIG: AxiosRequestConfig = {};
export const DEFAULT_MONITOR_INTERVAL = 1_200_000;

/**
 * Lớp Scraper là lớp trừu tượng để cào dữ liệu từ các nguồn anime hoặc manga.
 * Cung cấp các phương thức để cào dữ liệu từng trang hoặc nhiều trang.
 *
 * @abstract
 */
export default abstract class Scraper<T> {
  /** Axios client để thực hiện các yêu cầu HTTP */
  client: AxiosInstance;

  /** ID của nguồn dữ liệu */
  id: string;

  /** Tên của nguồn dữ liệu */
  name: string;

  /** URL gốc của nguồn dữ liệu */
  baseURL: string;

  /** Danh sách các tiêu đề bị loại bỏ (nếu có) */
  blacklistTitles: string[];

  /** URL dùng để giám sát và kiểm tra nguồn dữ liệu */
  monitorURL: string;

  /** Khoảng thời gian giữa các lần giám sát */
  monitorInterval: number;

  /** Cấu hình Axios cho các yêu cầu giám sát */
  monitorAxiosConfig: AxiosRequestConfig;

  /** Xác định có cho phép gửi yêu cầu giám sát hay không */
  disableMonitorRequest: boolean;

  /** Xác định có vô hiệu hóa giám sát hay không */
  disableMonitor: boolean;

  /** Danh sách các ngôn ngữ hỗ trợ của nguồn */
  locales: string[];

  /**
   * Tạo một đối tượng Scraper với các tham số cấu hình.
   *
   * @param {string} id - ID của nguồn.
   * @param {string} name - Tên của nguồn.
   * @param {RequireAtLeastOne<AxiosRequestConfig, 'baseURL'>} axiosConfig - Cấu hình Axios, bắt buộc có `baseURL`.
   */
  constructor(
    id: string,
    name: string,
    axiosConfig?: RequireAtLeastOne<AxiosRequestConfig, 'baseURL'>,
  ) {
    const config = {
      headers: {
        referer: axiosConfig.baseURL,
        origin: axiosConfig.baseURL,
      },
      timeout: 20000,
      ...axiosConfig,
    };
    this.disableMonitor = false;
    this.monitorAxiosConfig = config;
    this.client = axios.create(config);
    this.baseURL = axiosConfig.baseURL;
    this.monitorURL = axiosConfig.baseURL;
    this.monitorInterval = DEFAULT_MONITOR_INTERVAL;
    this.disableMonitorRequest = false;
    this.id = id;
    this.name = name;

    axiosRetry(this.client, { retries: 3 });

    const axiosErrorLogger = (error: AxiosError) => {
      return errorLogger(error, {
        logger: logger.error.bind(logger),
      });
    };

    this.client.interceptors.request.use((config) => {
      return config;
    }, axiosErrorLogger);

    this.client.interceptors.response.use(
      (response) => response,
      axiosErrorLogger,
    );
  }

  /**
   * Cào tất cả các trang manga hoặc anime cho đến khi hết dữ liệu.
   *
   * @protected
   * @returns {Promise<T[]>} - Trả về một Promise chứa mảng kiểu T.
   */
  protected async scrapeAllPages(): Promise<T[]> {
    const list: T[] = [];
    let isEnd = false;
    let page = 1;

    while (!isEnd) {
      try {
        const result = await this.scrapePage(page);
        if (!result || !result.length) {
          isEnd = true;
          break;
        }
        console.log(`Scraped page ${page} - ${this.id}`);
        page++;
        list.push(...result); // Sử dụng spread operator để thêm các phần tử vào list
      } catch (error) {
        isEnd = true;
      }
    }

    return list;
  }

  /**
   * Cào một số lượng trang giới hạn từ nguồn manga hoặc anime.
   *
   * @protected
   * @param {number} numOfPages - Số lượng trang cần cào.
   * @returns {Promise<T[]>} - Trả về một Promise chứa mảng kiểu T.
   */
  protected async scrapeNumOfPages(numOfPages: number): Promise<T[]> {
    const list: T[] = [];

    for (let page = 1; page <= numOfPages; page++) {
      const result = await this.scrapePage(page);
      console.log(`Scraped page ${page} [${this.id}]`);
      if (result?.length === 0) {
        break;
      }
      list.push(...result); // Sử dụng spread operator để thêm các phần tử vào list
    }
    return list;
  }

  /**
   * Tách tiêu đề trong trường hợp tiêu đề có nhiều tiêu đề (ví dụ: "One Piece | Vua Hải Tặc")
   * @param title string
   * @param separators một mảng các dấu phân cách
   * @returns một mảng các tiêu đề
   */
  parseTitle(title: string, separators = ['|', ',', ';', '-', '/']) {
    const separator = separators.find((separator) => title.includes(separator));

    const regex = new RegExp(`\\${separator}\\s+`);

    return title
      .split(regex)
      .map((title) => title.trim())
      .filter((title) => title);
  }

  /**
   * Phương thức trừu tượng để cào dữ liệu từ một trang cụ thể của nguồn.
   * Phương thức này phải được thực thi trong các lớp con.
   *
   * @abstract
   * @param {number} _page - trang cần cào.
   * @returns {Promise<T[]>} - Trả về một Promise chứa mảng kiểu T.
   */
  abstract scrapePage(_page: number): Promise<T[]>;
}
