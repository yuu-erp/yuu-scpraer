import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MangaService } from './manga.service';
import { XApiKeyGuard } from 'src/guards/x-api-key.guard';
import { PaginationPayloadDto } from 'src/dto/pagination-payload.dto';

@Controller('manga')
export class MangaController {
  constructor(private readonly mangaService: MangaService) {}

  @UseGuards(XApiKeyGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllMangas(@Query() query: PaginationPayloadDto) {
    return this.mangaService.getAllMangas(query.page, query.limit);
  }
}
