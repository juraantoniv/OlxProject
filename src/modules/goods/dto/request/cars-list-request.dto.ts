import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CarsListRequestDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 5;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(99999)
  @IsOptional()
  minValue?: number = 4000;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(99999)
  @IsOptional()
  maxValue?: number = 1500;

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
  @Type(() => String)
  @IsString()
  price?: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  ORDER?: 'ASC' | 'DESC';
}
