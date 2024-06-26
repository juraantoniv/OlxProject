import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { IUserData } from '../auth/interfaces/user-data.interface';
import { GoodsListRequestDto } from './dto/request/goods-list-request.dto';
import { GoodsEntity } from '../../database/entities/goods.entity';

@Injectable()
export class GoodsRepository extends Repository<GoodsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(GoodsEntity, dataSource.manager);
  }

  public async getList(
    query: GoodsListRequestDto,
    userData: IUserData,
  ): Promise<[GoodsEntity[], number]> {
    console.log(query.search_field);
    const qb = this.createQueryBuilder('goods');
    qb.leftJoinAndSelect('goods.user', 'user');
    qb.leftJoinAndSelect('goods.likes', 'likes');
    qb.leftJoinAndSelect('goods.views', 'views');
    // qb.where('goods.active = :active', { active: 'active' });

    if (query.category) {
      qb.where('goods.category = :category', { category: query.category });
    }
    if (query.region) {
      qb.where('goods.region = :region', { region: query.region });
    }

    if (query.search_field) {
      console.log(query.search_field);
      qb.andWhere(
        'CONCAT(LOWER(goods.title), LOWER(goods.description)) LIKE :search',
      );
    }

    if (query.maxValue && query.minValue) {
      qb.andWhere('goods.price >= :min');
      qb.andWhere('goods.price < :max').setParameters({
        max: query.maxValue,
        min: query.minValue,
      });
    }

    if (query.search) {
      qb.andWhere(
        'CONCAT(LOWER(goods.title), LOWER(goods.description), LOWER(goods.region)) LIKE :search',
      );
      qb.setParameter('search', `%${query.search.toLowerCase()}%`);
    }
    if (userData) {
      qb.setParameter('myId', userData.userId);
    }
    qb.setParameter('min', query.minValue);
    qb.setParameter('max', query.maxValue);
    qb.setParameter('search', `%${query?.search_field?.toLowerCase()}%`);
    qb.addOrderBy('goods.price', query.ORDER);
    qb.take(query.limit);
    qb.skip(query.offset);
    return await qb.getManyAndCount();
  }
  public async getById(id: string) {
    const qb = this.createQueryBuilder('goods');
    qb.leftJoinAndSelect('goods.views', 'views');
    qb.leftJoinAndSelect('goods.likes', 'likes');
    qb.setParameter('goodsId', id);
    qb.where('goods.id=:goodsId');
    return await qb.getOne();
  }
  public async getUsersGoods(id: string, query: GoodsListRequestDto) {
    const qb = this.createQueryBuilder('goods');
    qb.where('goods.user_id=:goodsId');
    qb.setParameter('goodsId', id);
    return await qb.getManyAndCount();
  }

  public async getAllGoods() {
    return await this.find();
  }
  public async findStatics(query: GoodsListRequestDto) {
    const qb = this.createQueryBuilder('goods');
    qb.select('goods.region');
    qb.addSelect('SUM(goods.price)', 'sum');
    qb.groupBy('goods.region');
    return await qb.getRawMany();
  }

  public async findViews() {
    const qb = this.createQueryBuilder('goods');
    qb.select('goods.category');
    qb.addSelect('SUM(goods.price)', 'views');
    qb.groupBy('goods.category');
    return await qb.getRawMany();
  }
}
