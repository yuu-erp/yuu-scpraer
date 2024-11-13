import { Type } from 'class-transformer';
import { IsInt, Min, Max, IsEnum } from 'class-validator';
import { MangaType } from 'src/types/utils';

export class PaginationPayloadDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number;

  @IsEnum(MangaType)
  type: MangaType;
}
