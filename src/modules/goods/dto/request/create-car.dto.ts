import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Length } from 'class-validator';

export class CreateCarDto {
  @IsString()
  @Length(2, 20)
  @Transform(({ value }) => value.trim())
  title: string;

  @IsString()
  @Length(2, 20)
  // @ApiProperty({ name: 'brand', enum: ECars })
  // @IsEnum(ECars)
  @Transform(({ value }) => value.trim())
  location: string;

  @IsString()
  @Length(2, 20)
  // @ApiProperty({ name: 'brand', enum: ECars })
  // @IsEnum(ECars)
  @Transform(({ value }) => value.trim())
  region: string;

  @IsString()
  price: string;

  @IsString()
  description: string;
}
