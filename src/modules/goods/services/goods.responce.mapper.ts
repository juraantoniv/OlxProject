import * as dotenv from 'dotenv';
import { join } from 'path';

import getConfigs from '../../../common/configs/configs';

import { GoodsListRequestDto } from '../dto/request/goods-list-request.dto';
import {
  CarList,
  CarListPrem,
  CarsResponseDto,
} from '../dto/responce/cars.response.dto';
import { GoodsEntity } from '../../../database/entities/goods.entity';

dotenv.config({ path: './environments/local.env' });

const awsConfig = getConfigs().aws;

export class GoodsResponseMapper {
  public static toResponseDto(GoodsEntity: Partial<GoodsEntity>): CarList {
    return {
      id: GoodsEntity.id,
      active: GoodsEntity.active,
      title: GoodsEntity.title,
      region: GoodsEntity.region,
      location: GoodsEntity.location,
      price: GoodsEntity.price,
      category: GoodsEntity.category,
      image: `${awsConfig.aws_url}${GoodsEntity.image}`,
      description: GoodsEntity.description,
      currency_type: GoodsEntity.currency_type,
      likes: GoodsEntity?.likes?.map((el) => el),
    };
  }
  public static toResponseDtoViews(
    GoodsEntity: Partial<GoodsEntity>,
  ): CarListPrem {
    return {
      id: GoodsEntity.id,
      title: GoodsEntity.title,
      region: GoodsEntity.region,
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
  ): CarsResponseDto<CarList[]> {
    return {
      data: carEntity?.map(this.toResponseDto),
      total: total,
      limit: query.limit,
      offset: query.offset,
    };
  }
  public static PremResponseManyDto(
    carEntity: Partial<GoodsEntity[]>,
    total: number,
    query: GoodsListRequestDto,
  ): CarsResponseDto<CarListPrem[]> {
    return {
      data: carEntity?.map(this.toResponseDtoViews),
      total: total,
      limit: query.limit,
      offset: query.offset,
    };
  }
}
