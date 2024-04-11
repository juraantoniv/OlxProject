import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entities';
import { TableNameEnum } from '../../common/enums/table.name.enum';
import { GoodsEntity } from './goods.entity';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.VIEWS)
export class ViewsEntity extends BaseEntity {
  @Column()
  good_id: string;
  @ManyToOne(() => GoodsEntity, (entity) => entity.views, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'good_id' })
  good?: GoodsEntity;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.views)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
