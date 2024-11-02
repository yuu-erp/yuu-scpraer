import { ConfigurationType } from './configuration.type';

export const configuration = (): ConfigurationType => ({
  port: Number(process.env.PORT) || 2025,
  apiKey: process.env.X_API_KEY || '',
  discordBotToken: process.env.DISCORD_BOT_TOKEN || '',
});
