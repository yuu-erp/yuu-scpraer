import { PrismaService } from 'src/service/prismaService/prisma.service';
import { Manga } from 'src/types/data';

export default class ActionManga {
  private prismaService: PrismaService;

  constructor() {
    this.prismaService = new PrismaService();
  }

  async saveMangaWithChapters(mergedSources: Manga[]) {
    try {
      for (const mangaData of mergedSources) {
        // Upsert Manga
        const manga = await this.prismaService.manga.upsert({
          where: { id: mangaData.sourceMangaConnection.id },
          update: {
            sourceId: mangaData.sourceMangaConnection.sourceId,
            sourceMediaId: mangaData.sourceMangaConnection.sourceMediaId,
            sourceConnectionId: mangaData.sourceMangaConnection.id,
            anilistId: mangaData.anilistId ?? null,
            coverImage: mangaData.sourceMangaConnection.coverImage,
            titles: mangaData.sourceMangaConnection.titles,
          },
          create: {
            id: mangaData.sourceMangaConnection.id,
            sourceId: mangaData.sourceMangaConnection.sourceId,
            sourceMediaId: mangaData.sourceMangaConnection.sourceMediaId,
            sourceConnectionId: mangaData.sourceMangaConnection.id,
            anilistId: mangaData.anilistId ?? null,
            coverImage: mangaData.sourceMangaConnection.coverImage,
            titles: mangaData.sourceMangaConnection.titles,
          },
        });

        // Upsert Chapters
        for (const chapter of mangaData.chapters) {
          await this.prismaService.chapter.upsert({
            where: {
              mangaId_sourceChapterId: {
                mangaId: manga.id, // ID của manga hiện tại
                sourceChapterId: chapter.sourceChapterId, // ID của chapter trong nguồn
              },
            },
            update: {
              name: chapter.name,
              sourceConnectionId: chapter.sourceConnectionId,
              sourceMediaId: chapter.sourceMediaId,
              sourceId: chapter.sourceId,
              slug: chapter.slug,
            },
            create: {
              name: chapter.name,
              sourceConnectionId: chapter.sourceConnectionId,
              sourceMediaId: chapter.sourceMediaId,
              sourceChapterId: chapter.sourceChapterId,
              sourceId: chapter.sourceId,
              slug: chapter.slug,
              mangaId: manga.id,
            },
          });
        }
        console.log(
          'manga and chapters saved successfully.' + manga.sourceConnectionId,
        );
      }

      console.log('All manga and chapters saved successfully.');
      return mergedSources;
    } catch (error) {
      console.error('Error in saveMangaWithChapters:', error);
      throw error;
    }
  }
}
