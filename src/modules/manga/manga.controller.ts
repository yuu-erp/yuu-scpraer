import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MangaService } from './manga.service';
import { XApiKeyGuard } from 'src/guards/x-api-key.guard';
import { PaginationPayloadDto } from 'src/dto/pagination-payload.dto';
import { MangaType } from 'src/types/utils';

@Controller('manga')
export class MangaController {
  constructor(private readonly mangaService: MangaService) {}

  @UseGuards(XApiKeyGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllMangas(
    @Query() query: PaginationPayloadDto,
    @Query('type') type: MangaType = MangaType.All,
  ) {
    return this.mangaService.getAllMangas(query.page, query.limit, type);
  }

  @UseGuards(XApiKeyGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getMangaById(@Param('id') id: string) {
    return this.mangaService.getMangaById(id);
  }
}
