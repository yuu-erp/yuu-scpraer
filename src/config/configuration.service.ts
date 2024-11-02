import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from './configuration.type';
@Injectable()
export class ConfigurationService implements ConfigurationType {
  constructor(private configService: ConfigService<ConfigurationType, true>) {}
  get port(): number {
    return this.configService.get('port');
  }
  get apiKey(): string {
    return this.configService.get('apiKey');
  }
  get discordBotToken(): string {
    return this.configService.get('discordBotToken');
  }
}
