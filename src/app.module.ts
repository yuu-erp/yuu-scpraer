import { Module } from '@nestjs/common';
import { ConfigurationModule } from './config/configuration.module';
import { LoggerModule } from './service/loggerService/logger.module';
import { DiscordModule } from './service/discordService/discord.module';
import { MangaModule } from './modules/manga/manga.module';
import { PrismaModule } from './service/prismaService/prisma.module';
import { AnilistModule } from './service/anilistService/anilist.module';

@Module({
  imports: [
    ConfigurationModule,
    PrismaModule,
    LoggerModule,
    DiscordModule,
    MangaModule,
    AnilistModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
