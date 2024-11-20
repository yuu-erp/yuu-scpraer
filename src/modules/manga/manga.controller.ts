import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { XApiKeyGuard } from 'src/guards/x-api-key.guard';
import { MangaService } from './manga.service';
import { PaginationPayloadDto } from 'src/responses/dto/pagination-payload.dto';

@Controller('manga')
export class MangaController {
  constructor(private readonly mangaService: MangaService) {}

  @UseGuards(XApiKeyGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllMangas(@Query() query: PaginationPayloadDto) {
    return this.mangaService.getAllMangas(query);
  }

  @UseGuards(XApiKeyGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getMangaById(@Param('id') id: string) {
    return this.mangaService.getMangaById(id);
  }
}
