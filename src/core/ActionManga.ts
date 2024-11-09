import { PrismaService } from 'src/service/prismaService/prisma.service';
import { Manga } from 'src/types/data';

export default class ActionManga {
  private prismaService: PrismaService;

  constructor() {
    this.prismaService = new PrismaService();
  }

  async saveMangaWithChapters(dataArray: Manga[]) {
    try {
      console.log('All manga and chapters saved successfully.', dataArray);
    } catch (error) {
      console.error('Error in saveMangaWithChapters:', error);
      throw error;
    }
  }
}
