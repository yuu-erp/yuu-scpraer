import { AnilistService } from 'src/service/anilistService/anilist.service';
import { MediaType } from 'src/types/anilist';
import { Manga, SourceManga } from 'src/types/data';
import { isVietnamese } from 'src/utils';

export type ConnectionArgs = {
  sourceId: string;
  sourceMediaId: string;
  mediaId: number;
  titles: string[];
  coverImage: string;
};

export type ChapterArgs = {
  name: string;
  sourceMediaId: string;
  sourceId: string;
  sourceChapterId: string;
  slug: string;
};
export default class AnilistMergeScraper {
  private anilistService: AnilistService;
  constructor() {
    this.anilistService = new AnilistService();
  }

  async getRetriesId<T extends MediaType>(titles: string[], type: T) {
    for (const title of titles) {
      if (isVietnamese(title)) continue;
      const data = await this.anilistService.getIdByTitle(title, type);
      if (data) return data;
    }
    return null;
  }

  mergeMangaConnection({
    sourceId,
    sourceMediaId,
    mediaId,
    titles,
    coverImage,
  }: ConnectionArgs) {
    return {
      id: `${sourceMediaId}-${sourceId}`,
      mediaId,
      sourceMediaId,
      sourceId,
      titles,
      coverImage,
    };
  }

  mergeMangaChapter({
    name,
    sourceMediaId,
    sourceId,
    sourceChapterId,
    slug,
  }: ChapterArgs) {
    return {
      name: name,
      sourceConnectionId: `${sourceMediaId}-${sourceId}`,
      sourceMediaId,
      sourceChapterId,
      sourceId,
      slug: slug,
    };
  }

  mergeMangaInfo(source: SourceManga, anilistId: number): Manga {
    return {
      anilistId,
      sourceMangaConnection: this.mergeMangaConnection({
        mediaId: anilistId,
        sourceId: source.sourceId,
        sourceMediaId: source.sourceMediaId,
        titles: source.titles,
        coverImage: source.coverImage,
      }),
      chapters: source.chapters.map((chapter) =>
        this.mergeMangaChapter({
          name: chapter.name,
          sourceMediaId: source.sourceMediaId,
          sourceId: source.sourceId,
          sourceChapterId: chapter.sourceChapterId,
          slug: chapter.slug,
        }),
      ),
    };
  }
}
