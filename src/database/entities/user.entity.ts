import { IsEnum } from 'class-validator';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entities';
import { ERights, EType, EUserBanned } from '../../common/enums/users.rights.enum';
import { Car_DealershipEntity } from './car_dealership.entity';
import { CarsEntity } from './cars.entity';
import { LikeEntity } from './like.entity';
import { RefreshTokenEntity } from './refresh.token.entity';
import { ViewsEntity } from './views.entity';

@Entity('usersData')
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

  @OneToMany(() => CarsEntity, (entity) => entity.user)
  cars?: CarsEntity[];

  @OneToMany(() => LikeEntity, (entity) => entity.user)
  likes?: LikeEntity[];

  @OneToOne(() => Car_DealershipEntity, (entity) => entity.user)
  dealer?: Car_DealershipEntity;

  @OneToMany(() => ViewsEntity, (entity) => entity.user)
  views?: ViewsEntity[];
}
