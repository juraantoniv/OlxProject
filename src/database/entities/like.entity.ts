import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entities';
import { TableNameEnum } from '../../common/enums/table.name.enum';
import { UserEntity } from './user.entity';
import { GoodsEntity } from './goods.entity';

@Entity(TableNameEnum.LIKES)
export class LikeEntity extends BaseEntity {
  @Column()
  good_id: string;
  @ManyToOne(() => GoodsEntity, (entity) => entity.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'good_id' })
  goods?: GoodsEntity;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.likes)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
