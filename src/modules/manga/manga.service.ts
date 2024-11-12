import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prismaService/prisma.service';
import { MangaResponseDto } from './dto/manga-response.dto';
import { PaginationResponseDto } from 'src/dto/pagination-response.dto';

@Injectable()
export class MangaService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllMangas(
    page: number,
    limit: number,
  ): Promise<PaginationResponseDto<MangaResponseDto>> {
    const skip = (page - 1) * limit;

    const [mangas, total] = await Promise.all([
      this.prismaService.manga.findMany({
        skip,
        take: limit,
      }),
      this.prismaService.manga.count(),
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
}
