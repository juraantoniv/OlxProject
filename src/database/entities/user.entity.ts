import { IsEnum } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entities';
import {
  ERights,
  EType,
  EUserBanned,
} from '../../common/enums/users.rights.enum';
import { GoodsEntity } from './goods.entity';
import { LikeEntity } from './like.entity';
import { RefreshTokenEntity } from './refresh.token.entity';
import { ViewsEntity } from './views.entity';
import { MessageEntity } from './message.entity';
import { TableNameEnum } from '../../common/enums/table.name.enum';

@Entity(TableNameEnum.USERS)
export class UserEntity extends BaseEntity {
  @Column('text')
  name: string;

  @Column('text')
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('int')
  age: number;

  @Column('text', { nullable: true })
  phone: string;

  @Column('text', { nullable: true })
  city: string;

  @Column({
    type: 'enum',
    enum: ERights,
    default: ERights.Costumer,
  })
  @IsEnum(ERights)
  role: ERights;

  @Column({
    type: 'enum',
    enum: EType,
    default: EType.Default,
  })
  @IsEnum(ERights)
  userPremiumRights: EType;

  @Column({
    type: 'enum',
    enum: EUserBanned,
    default: EUserBanned.ACTIVE,
  })
  @IsEnum(EUserBanned)
  active: EUserBanned;

  @Column('text', { nullable: true, default: null })
  avatar: string;

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];

  @OneToMany(() => GoodsEntity, (entity) => entity.user)
  goods?: GoodsEntity[];

  @OneToMany(() => LikeEntity, (entity) => entity.user)
  likes?: LikeEntity[];

  @OneToMany(() => ViewsEntity, (entity) => entity.user)
  views?: ViewsEntity[];

  @OneToMany(() => MessageEntity, (entity) => entity.user)
  messages?: MessageEntity[];

  @OneToMany(() => MessageEntity, (entity) => entity.usersMassages)
  sendedMessages?: MessageEntity[];
}
