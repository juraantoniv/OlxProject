import * as dotenv from 'dotenv';
import { join } from 'path';

import getConfigs from '../../../common/configs/configs';

import { GoodsListRequestDto } from '../dto/request/goods-list-request.dto';
import {
  CarListDto,
  CarListPremDto,
  CarsResponseDto,
} from '../dto/responce/cars.response.dto';
import { GoodsEntity } from '../../../database/entities/goods.entity';

dotenv.config({ path: './environments/local.env' });

const awsConfig = getConfigs().aws;

export class GoodsResponseMapper {
  public static toResponseDto(GoodsEntity: Partial<GoodsEntity>): CarListDto {
    return {
      id: GoodsEntity.id,
      user_id: GoodsEntity.user_id,
      active: GoodsEntity.active,
      title: GoodsEntity.title,
      region: GoodsEntity.region,
      location: GoodsEntity.location,
      price: GoodsEntity.price,
      created: GoodsEntity.created,
      category: GoodsEntity.category,
      image: `${awsConfig.aws_url}${GoodsEntity.image}`,
      description: GoodsEntity.description,
      currency_type: GoodsEntity.currency_type,
      likes: GoodsEntity?.likes?.map((el) => el),
    };
  }
  public static toResponseDtoViews(
    GoodsEntity: Partial<GoodsEntity>,
  ): CarListPremDto {
    return {
      id: GoodsEntity.id,
      created: GoodsEntity.created,
      title: GoodsEntity.title,
      region: GoodsEntity.region,
      user_id: GoodsEntity.user_id,
      location: GoodsEntity.location,
      price: GoodsEntity.price,
      active: GoodsEntity.active,
      category: GoodsEntity.category,
      image: `${awsConfig.aws_url}${GoodsEntity.image}`,
      description: GoodsEntity.description,
      currency_type: GoodsEntity.currency_type,
      views: GoodsEntity.views,
      likes: GoodsEntity?.likes?.map((el) => el),
    };
  }
  public static toResponseManyDto(
    carEntity: Partial<GoodsEntity[]>,
    total: number,
    query: GoodsListRequestDto,
  ): CarsResponseDto {
    return {
      data: carEntity?.map(this.toResponseDto),
      total: total,
      limit: query.limit,
      offset: query.offset,
    };
  }
  public static responseDtoForMany(
    carEntity: Partial<GoodsEntity[]>,
  ): CarListDto[] {
    return carEntity?.map(this.toResponseDto);
  }
  public static PremResponseManyDto(
    carEntity: Partial<GoodsEntity[]>,
    total: number,
    query: GoodsListRequestDto,
  ): CarsResponseDto {
    return {
      data: carEntity?.map(this.toResponseDtoViews),
      total: total,
      limit: query.limit,
      offset: query.offset,
    };
  }
}
