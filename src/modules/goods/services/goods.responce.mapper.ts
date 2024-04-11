import * as dotenv from 'dotenv';
import { join } from 'path';

import getConfigs from '../../../common/configs/configs';

import { CarsListRequestDto } from '../dto/request/cars-list-request.dto';
import {
  CarList,
  CarListPrem,
  CarsResponseDto,
} from '../dto/responce/cars.response.dto';
import { GoodsEntity } from '../../../database/entities/goods.entity';

dotenv.config({ path: './environments/local.env' });

const awsConfig = getConfigs().aws;

export class CarsResponseMapper {
  public static toResponseDto(GoodsEntity: Partial<GoodsEntity>): CarList {
    return {
      messages: GoodsEntity.messages.map((el) => el.messages),
      id: GoodsEntity.id,
      region: GoodsEntity.region,
      location: GoodsEntity.location,
      price: GoodsEntity.price,
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
      region: GoodsEntity.region,
      location: GoodsEntity.location,
      price: GoodsEntity.price,
      image: `${awsConfig.aws_url}${GoodsEntity.image}`,
      description: GoodsEntity.description,
      messages: GoodsEntity.messages.map((el) => el.messages),
      currency_type: GoodsEntity.currency_type,
      views: GoodsEntity.views,
      likes: GoodsEntity.likes?.map((el) => el),
    };
  }
  public static toResponseManyDto(
    carEntity: Partial<GoodsEntity[]>,
    total: number,
    query: CarsListRequestDto,
  ): CarsResponseDto<CarList[]> {
    return {
      data: carEntity.map(this.toResponseDto),
      total: total,
      limit: query.limit,
      offset: query.offset,
    };
  }
  public static PremResponseManyDto(
    carEntity: Partial<GoodsEntity[]>,
    total: number,
    query: CarsListRequestDto,
  ): CarsResponseDto<CarListPrem[]> {
    return {
      data: carEntity.map(this.toResponseDtoViews),
      total: total,
      limit: query.limit,
      offset: query.offset,
    };
  }
}
