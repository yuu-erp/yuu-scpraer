import * as fs from 'fs';
import { handlePath } from 'src/utils';
import type MangaScraper from 'src/core/MangaScraper';
import AnimeScraper from 'src/core/AnimeScraper';

export type MangaScraperId = string;
export type AnimeScraperId = string;

const readScrapers = <T>(
  relativePath: string,
): Record<MangaScraperId | AnimeScraperId, T> => {
  const absolutePath = handlePath(relativePath);
  if (!fs.existsSync(absolutePath)) {
    console.warn(`Directory ${absolutePath} does not exist.`);
    return {};
  }

  const scraperFiles = fs
    .readdirSync(absolutePath)
    .filter((file) => file.endsWith('.ts'))
    .map((file) => file.replace('.ts', ''));

  const scrapers: Record<MangaScraperId | AnimeScraperId, T> = {};

  for (const file of scraperFiles) {
    const { default: Scraper } = require(
      handlePath(`${relativePath}/${file}`, __dirname),
    );
    scrapers[file] = new Scraper();
  }
  return scrapers;
};

// Reading manga and anime scrapers
const mangaScrapers: Record<MangaScraperId, MangaScraper> =
  readScrapers<MangaScraper>('./manga');
const animeScrapers: Record<AnimeScraperId, AnimeScraper> =
  readScrapers<AnimeScraper>('./anime');

export default {
  manga: mangaScrapers,
  anime: animeScrapers,
};
