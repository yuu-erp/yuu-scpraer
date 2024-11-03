import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, GatewayIntentBits, Events } from 'discord.js';
import { ConfigurationService } from 'src/config/configuration.service';
import sources, { MangaScraperId } from '../../sources';
import { readFileAndFallback } from 'src/utils';
@Injectable()
export class DiscordService implements OnModuleInit {
  private client: Client;

  constructor(private readonly configurationService: ConfigurationService) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
  }

  async onModuleInit() {
    await this.client.login(this.configurationService.discordBotToken);
    this.setupEventHandlers();
    const mangaScraper = sources.manga;
    const scraper = mangaScraper['nettruyenviet' as MangaScraperId];
    const manga = await readFileAndFallback(`./data/nettruyenviet.json`, () =>
      scraper.scrapeAllMangaPages(),
    );
    const mergedSources = await readFileAndFallback(
      `./data/nettruyenviet-full.json`,
      () => scraper.scrapeAnilist(manga),
    );
  }

  private setupEventHandlers() {
    this.client.on(Events.MessageCreate, async (message) => {
      if (message.author.bot) return;
      const userMessage = message.content;
      console.log('Nội dung tin nhắn:', userMessage);
      try {
      } catch (error) {}
    });
  }
}
