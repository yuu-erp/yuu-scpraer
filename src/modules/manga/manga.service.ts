import { Injectable } from '@nestjs/common';
import { MangaResponse } from 'src/responses/manga.response';
import { MangaResponseDto } from './dto/manga-response.dto';
import { PaginationPayloadDto } from 'src/responses/dto/pagination-payload.dto';
import { PaginationResponseDto } from 'src/responses/dto/pagination-response.dto';

@Injectable()
export class MangaService {
  constructor(private readonly mangaResponse: MangaResponse) {}

  async getAllMangas(
    query: PaginationPayloadDto,
  ): Promise<PaginationResponseDto<MangaResponseDto>> {
    return this.mangaResponse.findAll(query);
  }

  async getMangaById(id: string) {
    return this.mangaResponse.findOne(id);
  }
}
