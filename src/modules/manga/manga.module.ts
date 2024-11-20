import { Module } from '@nestjs/common';
import { MangaController } from './manga.controller';
import { MangaService } from './manga.service';
import { MangaResponse } from 'src/responses/manga.response';

@Module({
  imports: [],
  controllers: [MangaController],
  providers: [MangaService, MangaResponse],
})
export class MangaModule {}
