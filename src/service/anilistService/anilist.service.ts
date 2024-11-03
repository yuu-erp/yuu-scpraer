import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { Media, MediaType } from 'src/types/anilist';
import { findBestMatch } from 'src/utils';

@Injectable()
export class AnilistService {
  private readonly ANILIST_API_URL = 'https://graphql.anilist.co';
  private readonly idQuery = `
query (
  $id: Int
  $idMal: Int
  $startDate: FuzzyDateInt
  $endDate: FuzzyDateInt
  $season: MediaSeason
  $seasonYear: Int
  $type: MediaType
  $format: MediaFormat
  $status: MediaStatus
  $episodes: Int
  $duration: Int
  $chapters: Int
  $volumes: Int
  $isAdult: Boolean
  $genre: String
  $tag: String
  $minimumTagRank: Int
  $tagCategory: String
  $onList: Boolean
  $licensedBy: String
  $licensedById: Int
  $averageScore: Int
  $popularity: Int
  $source: MediaSource
  $countryOfOrigin: CountryCode
  $isLicensed: Boolean
  $search: String
  $id_not: Int
  $id_in: [Int]
  $id_not_in: [Int]
  $idMal_not: Int
  $idMal_in: [Int]
  $idMal_not_in: [Int]
  $startDate_greater: FuzzyDateInt
  $startDate_lesser: FuzzyDateInt
  $startDate_like: String
  $endDate_greater: FuzzyDateInt
  $endDate_lesser: FuzzyDateInt
  $endDate_like: String
  $format_in: [MediaFormat]
  $format_not: MediaFormat
  $format_not_in: [MediaFormat]
  $status_in: [MediaStatus]
  $status_not: MediaStatus
  $status_not_in: [MediaStatus]
  $episodes_greater: Int
  $episodes_lesser: Int
  $duration_greater: Int
  $duration_lesser: Int
  $chapters_greater: Int
  $chapters_lesser: Int
  $volumes_greater: Int
  $volumes_lesser: Int
  $genre_in: [String]
  $genre_not_in: [String]
  $tag_in: [String]
  $tag_not_in: [String]
  $tagCategory_in: [String]
  $tagCategory_not_in: [String]
  $licensedBy_in: [String]
  $licensedById_in: [Int]
  $averageScore_not: Int
  $averageScore_greater: Int
  $averageScore_lesser: Int
  $popularity_not: Int
  $popularity_greater: Int
  $popularity_lesser: Int
  $source_in: [MediaSource]
  $sort: [MediaSort]
) {
  Media(
    id: $id
    idMal: $idMal
    startDate: $startDate
    endDate: $endDate
    season: $season
    seasonYear: $seasonYear
    type: $type
    format: $format
    status: $status
    episodes: $episodes
    duration: $duration
    chapters: $chapters
    volumes: $volumes
    isAdult: $isAdult
    genre: $genre
    tag: $tag
    minimumTagRank: $minimumTagRank
    tagCategory: $tagCategory
    onList: $onList
    licensedBy: $licensedBy
    licensedById: $licensedById
    averageScore: $averageScore
    popularity: $popularity
    source: $source
    countryOfOrigin: $countryOfOrigin
    isLicensed: $isLicensed
    search: $search
    id_not: $id_not
    id_in: $id_in
    id_not_in: $id_not_in
    idMal_not: $idMal_not
    idMal_in: $idMal_in
    idMal_not_in: $idMal_not_in
    startDate_greater: $startDate_greater
    startDate_lesser: $startDate_lesser
    startDate_like: $startDate_like
    endDate_greater: $endDate_greater
    endDate_lesser: $endDate_lesser
    endDate_like: $endDate_like
    format_in: $format_in
    format_not: $format_not
    format_not_in: $format_not_in
    status_in: $status_in
    status_not: $status_not
    status_not_in: $status_not_in
    episodes_greater: $episodes_greater
    episodes_lesser: $episodes_lesser
    duration_greater: $duration_greater
    duration_lesser: $duration_lesser
    chapters_greater: $chapters_greater
    chapters_lesser: $chapters_lesser
    volumes_greater: $volumes_greater
    volumes_lesser: $volumes_lesser
    genre_in: $genre_in
    genre_not_in: $genre_not_in
    tag_in: $tag_in
    tag_not_in: $tag_not_in
    tagCategory_in: $tagCategory_in
    tagCategory_not_in: $tagCategory_not_in
    licensedBy_in: $licensedBy_in
    licensedById_in: $licensedById_in
    averageScore_not: $averageScore_not
    averageScore_greater: $averageScore_greater
    averageScore_lesser: $averageScore_lesser
    popularity_not: $popularity_not
    popularity_greater: $popularity_greater
    popularity_lesser: $popularity_lesser
    source_in: $source_in
    sort: $sort
  ) {
    id
    synonyms
    title {
      romaji
      english
      native
      userPreferred
    }
  }
}
`;
  // Phương thức gửi request đến API Anilist
  private async sendQuery<T>(query: string, variables: any = {}): Promise<T> {
    try {
      const response = await axios.post(this.ANILIST_API_URL, {
        query,
        variables,
      });
      return response.data.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error querying AniList API',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getIdByTitle<T extends MediaType>(
    title: string,
    type: T,
  ): Promise<number> {
    try {
      const variables = {
        type,
        sort: 'SEARCH_MATCH',
        search: title,
      };
      const data = await this.sendQuery<{ Media: Media }>(
        this.idQuery,
        variables,
      );
      if (!data.Media) return null;
      const media = data.Media;
      const { bestMatch } = findBestMatch(title, [
        ...Object.values(media.title),
        ...media.synonyms,
      ]);
      console.log(bestMatch);
      console.log(title);
      if (bestMatch.rating < 0.6) {
        return null;
      }
      console.log('Success', title);
      return media?.id;
    } catch (error) {
      return null;
    }
  }
}
