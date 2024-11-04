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
export interface SourceMediaConnection {
  id: string;
  mediaId: number;
  sourceMediaId: string;
  sourceId: string;
  titles: string[];
  coverImage: string;
}
export type Chapter = {
  name: string;
  sourceId: string;
  sourceChapterId: string;
  sourceMediaId: string;
  slug: string;
  sourceConnectionId: string;
};

export type Anime = {};
export type Manga = {
  anilistId: number;
  chapters: Chapter[];
  sourceMangaConnection: SourceMediaConnection;
};
