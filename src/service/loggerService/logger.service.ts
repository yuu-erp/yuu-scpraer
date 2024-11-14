/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { Logger, createLogger, format, transports } from 'winston';
import { ConfigurationService } from '../../config/configuration.service';

@Injectable()
export class LoggerService extends ConsoleLogger {
  private logger: Logger;

  constructor(private configurationService: ConfigurationService) {
    super();
    const { combine, timestamp, printf, colorize, metadata } = format;
    this.logger = createLogger({
      format: combine(
        format.label({
          label: 'SPS_API_LOGGER',
        }),
        timestamp(),
        metadata(),
        printf((data) => {
          const {
            level,
            message,
            [Symbol.for('splat')]: sSplat,
            metadata: { correlationId, timestamp, label },
          } = data;

          const meta = sSplat[0]
            .map((item: any) =>
              JSON.stringify(item, Object.getOwnPropertyNames(item), 2),
            )
            .join('\n');
          return `[${label}] [${timestamp}] [${level.toUpperCase()}]${
            correlationId ? ` [${correlationId}] ` : ''
          }${message} ${meta}`;
        }),
      ),
      transports:
        this.configurationService.nodeEnv === 'development'
          ? [
              new transports.Console({
                format: colorize({ all: true }),
              }),
              new transports.File({
                filename: 'public/logs/rtc_logs.log',
              }),
            ]
          : [
              new transports.Console({
                format: colorize({ all: true }),
              }),
            ],
    });
  }

  set setCorrelationId(correlationId: string) {
    this.logger.defaultMeta = {
      ...this.logger.defaultMeta,
      correlationId,
    };
  }

  get getCorrelationId(): string {
    return this.logger.defaultMeta.correlationId;
  }

  log(message: string, ...meta: any[]) {
    this.logger.info(message, meta);
  }

  warn(message: string, ...meta: any[]) {
    this.logger.warn(message, meta);
  }

  error(message: string, ...meta: any[]) {
    this.logger.error(message, meta);
  }

  debug(message: string, ...meta: any[]) {
    this.logger.debug(message, meta);
  }
}
