import { Type } from 'class-transformer';
import { IsInt, Min, Max } from 'class-validator';

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
}
