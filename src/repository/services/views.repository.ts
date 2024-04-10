import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ViewsEntity } from '../../database/entities/views.entity';

@Injectable()
export class ViewsRepository extends Repository<ViewsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ViewsEntity, dataSource.manager);
  }
}
