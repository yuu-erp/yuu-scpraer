import { PrismaService } from 'src/service/prismaService/prisma.service';
import { Prisma } from '@prisma/client';

export default class ActionManga {
  private prismaService: PrismaService;

  constructor() {
    this.prismaService = new PrismaService();
  }

  async saveMangaWithChapters(dataArray: any[]) {
    try {
      // await Promise.all(dataArray.map(async (data) => {

      // }));

      console.log('All manga and chapters saved successfully.');
    } catch (error) {
      console.error('Error in saveMangaWithChapters:', error);
      throw error;
    }
  }
}
