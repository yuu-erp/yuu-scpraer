import { LoggerService } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { errorLogger } from 'axios-logger';
import axiosRetry from 'axios-retry';
import { RequireAtLeastOne } from 'src/types/utils';

export const DEFAULT_CONFIG: AxiosRequestConfig = {};
export const DEFAULT_MONITOR_INTERVAL = 1_200_000;

export class Scraper {
  client: AxiosInstance;
  id: string;
  name: string;
  baseURL: string;
  blacklistTitles: string[];
  monitorURL: string;
  monitorInterval: number;
  monitorAxiosConfig: AxiosRequestConfig;
  disableMonitorRequest: boolean;
  disableMonitor: boolean;
  locales: string[];

  private readonly loggerService: LoggerService;

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
        logger: this.loggerService.error.bind(this.loggerService),
      });
    };

    this.client.interceptors.request.use((config) => config, axiosErrorLogger);

    this.client.interceptors.response.use(
      (response) => response,
      axiosErrorLogger,
    );
  }
}
