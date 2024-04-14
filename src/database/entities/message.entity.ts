import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TableNameEnum } from '../../common/enums/table.name.enum';
import { BaseEntity } from '../../common/entities/base.entities';
import { GoodsEntity } from './goods.entity';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.MESSEGE)
export class MessageEntity extends BaseEntity {
  @Column()
  good_id: string;
  @ManyToOne(() => GoodsEntity, (entity) => entity.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'good_id' })
  goods?: GoodsEntity;

  @Column('text', { nullable: true })
  message: string;

  @Column('boolean', { default: false })
  read: boolean;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;


  @Column()
  users_id_massages: string;
  @ManyToOne(() => UserEntity, (entity) => entity.sendedMessages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'users_id_massages' })
  usersMassages?: UserEntity;
}
