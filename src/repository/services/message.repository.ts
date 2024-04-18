import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { MessageEntity } from '../../database/entities/message.entity';

@Injectable()
export class MessageRepository extends Repository<MessageEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(MessageEntity, dataSource.manager);
  }
  public async messagesUser(id: string) {
    try {
      const qb = this.createQueryBuilder('messege');
      qb.where('messege.user_id = :userId', { userId: id });
      return await qb.getManyAndCount();
    } catch (e) {
      console.log(e);
    }
  }
}
