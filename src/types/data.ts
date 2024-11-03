export interface SourceChapter {
  name: string;
  sourceChapterId: string;
  sourceMediaId: string;
  slug: string;
}

export type SourceManga = {
  titles: string[];
  coverImage: string;
  chapters: SourceChapter[];
  sourceId: string;
  sourceMediaId: string;
  anilistId?: number;
};
export type SourceAnime = {};

export type Anime = {};
export type Manga = {};
