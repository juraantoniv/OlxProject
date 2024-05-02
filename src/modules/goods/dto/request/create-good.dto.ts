import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsString, Length } from 'class-validator';
import { ECategory } from '../../../../common/enums/category.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGoodDto {
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
  @IsEnum(ECategory)
  category: ECategory;

  @IsInt()
  @Type(() => Number)
  price: number;

  @IsString()
  description: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
