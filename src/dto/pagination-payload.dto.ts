import { Type } from 'class-transformer';
import { IsInt, Min, Max, IsEnum } from 'class-validator';
import { MangaType } from 'src/types/utils';

export class PaginationPayloadDto {
  @Type(() => Number) // Chuyển đổi kiểu dữ liệu từ chuỗi sang số
  @IsInt()
  @Min(1)
  page: number;

  @Type(() => Number) // Chuyển đổi kiểu dữ liệu từ chuỗi sang số
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number;

  @IsEnum(MangaType) // Kiểm tra type phải là một giá trị hợp lệ của enum MangaType
  type: MangaType;
}
