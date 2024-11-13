import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/service/prismaService/prisma.service';
import { MangaResponseDto } from './dto/manga-response.dto';
import { PaginationResponseDto } from 'src/dto/pagination-response.dto';
import { MangaType } from 'src/types/utils';
import { AnilistService } from 'src/service/anilistService/anilist.service';

@Injectable()
export class MangaService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly anilistService: AnilistService,
  ) {}

  async getAllMangas(
    page: number,
    limit: number,
    type: MangaType = MangaType.All,
  ): Promise<PaginationResponseDto<MangaResponseDto>> {
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

  async getMangaById(id: string) {
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

  // Hàm hỗ trợ để lấy điều kiện "where" tùy theo type
  private getWhereCondition(type: MangaType) {
    switch (type) {
      case MangaType.Anilist:
        return { anilistId: { not: null } }; // Lọc manga có anilistId
      case MangaType.NoAnilist:
        return { anilistId: null }; // Lọc manga không có anilistId
      default:
        return {}; // Lọc tất cả
    }
  }
}
