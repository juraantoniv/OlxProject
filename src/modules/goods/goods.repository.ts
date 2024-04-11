import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { IUserData } from '../auth/interfaces/user-data.interface';
import { CarsListRequestDto } from './dto/request/cars-list-request.dto';
import { GoodsEntity } from '../../database/entities/goods.entity';

@Injectable()
export class GoodsRepository extends Repository<GoodsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(GoodsEntity, dataSource.manager);
  }

  public async getList(
    query: CarsListRequestDto,
    userData: IUserData,
  ): Promise<[GoodsEntity[], number]> {
    const qb = this.createQueryBuilder('cars');
    qb.leftJoinAndSelect('cars.likes', 'likes');
    qb.leftJoinAndSelect('cars.user', 'user');
    qb.leftJoinAndSelect('cars.views', 'views');
    qb.where('cars.active = :active', { active: 'active' });

    if (query.search) {
      qb.andWhere(
        'CONCAT(LOWER(cars.model), LOWER(cars.description), LOWER(cars.brand)) LIKE :search',
      );
      qb.setParameter('search', `%${query.search.toLowerCase()}%`);
    }
    qb.setParameter('myId', userData.userId);
    qb.setParameter('min', query.minValue);
    qb.setParameter('max', query.maxValue);
    qb.addOrderBy('cars.created', query.ORDER);
    qb.take(query.limit);
    qb.skip(query.offset);
    return await qb.getManyAndCount();
  }
  public async getById(id: string) {
    const qb = this.createQueryBuilder('cars');
    qb.leftJoinAndSelect('cars.views', 'views');
    qb.leftJoinAndSelect('cars.likes', 'likes', 'likes.cars_id = cars.id');
    qb.setParameter('carId', id);
    qb.where('cars.id=:carId');
    return await qb.getOne();
  }
}
