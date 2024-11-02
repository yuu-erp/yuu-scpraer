import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, GatewayIntentBits, Events } from 'discord.js';
import { ConfigurationService } from 'src/config/configuration.service';
import sources from '../../sources';
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
    console.log('mangaScraper: ', mangaScraper);
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
