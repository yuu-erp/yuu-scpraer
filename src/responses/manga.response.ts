import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/service/prismaService/prisma.service';
import { PaginationPayloadDto } from './dto/pagination-payload.dto';
import { PaginationResponseDto } from './dto/pagination-response.dto';
import { MangaResponseDto } from './dto/manga-response.dto';
import { MangaType } from 'src/types/utils';
import { AnilistService } from 'src/service/anilistService/anilist.service';

@Injectable()
export class MangaResponse {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly anilistService: AnilistService,
  ) {}

  async findAll(
    query: PaginationPayloadDto,
  ): Promise<PaginationResponseDto<MangaResponseDto>> {
    const { page, limit, type } = query;
    const skip = (page - 1) * limit;
    const whereCondition = this.getWhereCondition(type);

    const [mangas, total] = await Promise.all([
      this.prismaService.manga.findMany({
        skip,
        take: limit,
        where: whereCondition,
      }),
      this.prismaService.manga.count({
        where: whereCondition,
      }),
    ]);

    return {
      data: mangas,
      meta: {
        totalItems: total,
        currentPage: page,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const manga = await this.prismaService.manga.findUnique({
      where: { id },
      include: { chapters: true },
    });

    if (!manga) {
      throw new NotFoundException(`Manga with ID ${id} not found`);
    }
    if (manga.anilistId) {
      const dataAnilist = await this.anilistService.getMangaById(
        manga.anilistId,
      );
      return { ...manga, ...dataAnilist };
    }
    return manga;
  }

  private getWhereCondition(type: MangaType) {
    switch (type) {
      case MangaType.Anilist:
        return { anilistId: { not: null } };
      case MangaType.NoAnilist:
        return { anilistId: null };
      default:
        return {};
    }
  }
}
