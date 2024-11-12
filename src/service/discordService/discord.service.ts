import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, GatewayIntentBits, Events } from 'discord.js';
import { ConfigurationService } from 'src/config/configuration.service';
import sources, { MangaScraperId } from '../../sources';
import { readFileAndFallback } from 'src/utils';
import ActionManga from 'src/core/ActionManga';
@Injectable()
export class DiscordService implements OnModuleInit {
  private client: Client;
  private actionManga: ActionManga;
  constructor(private readonly configurationService: ConfigurationService) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    this.actionManga = new ActionManga();
  }

  async onModuleInit() {
    await this.client.login(this.configurationService.discordBotToken);
    this.setupEventHandlers();
    // const mangaScraper = sources.manga;
    // const scraper = mangaScraper['nettruyenviet' as MangaScraperId];
    // const manga = await readFileAndFallback(`./data/nettruyenviet.json`, () =>
    //   scraper.scrapeAllMangaPages(),
    // );
    // const mergedSources = await readFileAndFallback(
    //   `./data/nettruyenviet-full.json`,
    //   () => scraper.scrapeAnilist(manga),
    // );
    // await this.actionManga.saveMangaWithChapters(mergedSources);
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

  private async sendHelpMessage(message) {
    const helpMessage = `
      **Danh sách các lệnh hỗ trợ:**
      \`!help\` - Hiển thị danh sách các lệnh hỗ trợ.
      \`!scrapeManga\` - Lấy thông tin tất cả manga từ nguồn.
      \`!search [tên manga]\` - Tìm kiếm thông tin manga theo tên.
      \`!latest\` - Xem danh sách các manga mới cập nhật.
      \`!type\` - Xem danh mục scraper. 
      ...
    `;
    await message.reply(helpMessage);
  }
}
