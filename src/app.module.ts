import { Module } from '@nestjs/common';
import { ConfigurationModule } from './config/configuration.module';
import { LoggerModule } from './service/loggerService/logger.module';
import { DiscordModule } from './service/discordService/discord.module';
import { MangaModule } from './modules/manga/manga.module';

@Module({
  imports: [ConfigurationModule, LoggerModule, DiscordModule, MangaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
