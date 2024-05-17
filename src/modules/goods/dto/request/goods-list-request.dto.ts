import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class GoodsListRequestDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(99999)
  @IsOptional()
  minValue?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(99999)
  @IsOptional()
  maxValue?: number;

  @Type(() => String)
  @IsString()
  @IsOptional()
  search_field?: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  category?: string;


  @Type(() => String)
  @IsString()
  @IsOptional()
  region?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number = 0;

  @IsOptional()
  @Type(() => String)
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  price?: number;

  @IsOptional()
  @Type(() => String)
  @IsString()
  ORDER?: 'ASC' | 'DESC';
}
