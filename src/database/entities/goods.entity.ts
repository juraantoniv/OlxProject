import { IsEnum } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entities';
import { ERights } from '../../common/enums/users.rights.enum';
import { EActive } from '../../common/enums/valiid.enum';
import { LikeEntity } from './like.entity';
import { UserEntity } from './user.entity';
import { ViewsEntity } from './views.entity';
import { MessageEntity } from './message.entity';
import { ECategory } from '../../common/enums/category.enum';

@Entity('Goods')
export class GoodsEntity extends BaseEntity {
  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  location: string;

  @Column('text')
  region: string;

  @Column('text', { nullable: true })
  image: string;

  @Column('text', { default: 'UAH' })
  currency_type: string;

  @Column('text', { array: true, default: [] })
  favorite: string[];

  @Column('text')
  price: string;

  @Column({
    type: 'enum',
    enum: EActive,
    default: EActive.Nonactive,
  })
  @IsEnum(EActive)
  active: EActive;

  @Column({
    type: 'enum',
    enum: ECategory,
    default: ECategory.OTHER,
  })
  @IsEnum(ECategory)
  category: EActive;

  @Column('int', { default: 1 })
  check_of_valid: number;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.goods)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @OneToMany(() => LikeEntity, (entity) => entity.goods)
  likes?: LikeEntity[];

  @OneToMany(() => MessageEntity, (entity) => entity.goods)
  messages?: MessageEntity[];

  @OneToMany(() => ViewsEntity, (entity) => entity.good)
  views?: ViewsEntity[];
}
