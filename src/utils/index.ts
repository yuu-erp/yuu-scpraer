import * as path from 'path';
import * as fs from 'fs';

export const handlePath = (
  filePath: string,
  baseUrl: string = path.resolve(process.cwd(), './src/sources'),
) => path.join(baseUrl, filePath);

export const readFile = (filePath: string, basePath?: string) => {
  const fileDir = handlePath(filePath, basePath);

  if (!fs?.existsSync(fileDir)) return null;

  return fs.readFileSync(fileDir, 'utf-8');
};

export const readFileAndFallback = <T>(
  pathSub: string,
  fallbackFn?: () => Promise<T>,
) => {
  const fileContent: T = JSON.parse(
    readFile(pathSub, path.resolve(process.cwd(), './')),
  );

  if (!fileContent) return fallbackFn();

  return fileContent;
};

export const writeFile = (
  filePath: string,
  data: string,
  basePath?: string,
) => {
  const pathname = filePath.replace(/^\.*\/|\/?[^/]+\.[a-z]+|\/$/g, ''); // Remove leading directory markers, and remove ending /file-name.extension

  const pathDir = handlePath(pathname, basePath);

  if (!fs.existsSync(pathDir)) {
    fs.mkdirSync(pathDir, { recursive: true });
  }

  const fileDir = handlePath(filePath, basePath);

  fs.writeFileSync(fileDir, data, { flag: 'w' });
};

export const fulfilledPromises = <T extends Promise<any>>(promises: T[]) =>
  Promise.allSettled(promises).then((results) =>
    results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => (result as PromiseFulfilledResult<Awaited<T>>).value),
  );

export const isVietnamese = (text: string) => {
  const REGEX =
    /à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|ì|í|ị|ỉ|ĩ|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|ỳ|ý|ỵ|ỷ|ỹ|đ/g;

  return REGEX.test(text.toLowerCase());
};

type StringSimilarityOptions = {
  trimByString: string | RegExp;
  caseSensitive: boolean;
};

// https://github.com/17gstyron/useless-utils/blob/master/stringSimilarity.js
export const stringSimilarity = (
  stringOne: string,
  stringTwo: string,
  options: StringSimilarityOptions = {
    caseSensitive: true,
    trimByString: /\s/g,
  },
) => {
  const { trimByString = /\s/g, caseSensitive = true } = options;

  stringOne = stringOne.replace(trimByString, '');
  stringTwo = stringTwo.replace(trimByString, '');

  if (!caseSensitive) {
    stringOne = stringOne.toLowerCase();
    stringTwo = stringTwo.toLowerCase();
  }

  if (!stringOne.length && !stringTwo.length) return 1;
  if (!stringOne.length || !stringTwo.length) return 0;
  if (stringOne === stringTwo) return 1;
  if (stringOne.length === 1 && stringTwo.length === 1) return 0;
  if (stringOne.length < 2 || stringTwo.length < 2) return 0;

  const firstBigrams = new Map();
  for (let i = 0; i < stringOne.length - 1; i++) {
    const bigram = stringOne.substring(i, i + 2);
    const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1;

    firstBigrams.set(bigram, count);
  }

  let intersectionSize = 0;
  for (let i = 0; i < stringTwo.length - 1; i++) {
    const bigram = stringTwo.substring(i, i + 2);
    const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0;

    if (count > 0) {
      firstBigrams.set(bigram, count - 1);
      intersectionSize++;
    }
  }

  return (2.0 * intersectionSize) / (stringOne.length + stringTwo.length - 2);
};

// https://github.com/aceakash/string-similarity/blob/2718c82bbbf5190ebb8e9c54d4cbae6d1259527a/compare-strings.js#L42
export const findBestMatch = (mainString: string, targetStrings: string[]) => {
  targetStrings = targetStrings.filter((title) => title);

  type Rating = {
    target: string;
    rating: number;
  };

  const ratings: Rating[] = [];
  let bestMatchIndex = 0;

  for (let i = 0; i < targetStrings.length; i++) {
    const currentTargetString = targetStrings[i];
    const currentRating = stringSimilarity(mainString, currentTargetString);

    ratings.push({ target: currentTargetString, rating: currentRating });

    if (currentRating > ratings[bestMatchIndex].rating) {
      bestMatchIndex = i;
    }
  }

  const bestMatch = ratings[bestMatchIndex];

  return { ratings, bestMatch, bestMatchIndex };
};
