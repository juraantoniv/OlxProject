import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { MessageEntity } from '../../database/entities/message.entity';

@Injectable()
export class MessageRepository extends Repository<MessageEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(MessageEntity, dataSource.manager);
  }
  public async messagesUser(
    id: string,
  ): Promise<{ receiverId: string; messages: MessageEntity[] }[]> {
    const qb = this.createQueryBuilder('messege');
    qb.where('messege.users_id_massages = :senderId');
    qb.orWhere('messege.user_id = :senderId');
    qb.orderBy('messege.created', 'ASC');
    qb.setParameter('senderId', id);
    const dialogs = await qb.getMany();

    // Grouping messages by receiverId
    const dialogsByReceiver: { [receiverId: string]: MessageEntity[] } = {};
    dialogs.forEach((message) => {
      const receiverId =
        message.users_id_massages === id
          ? message.user_id
          : message.users_id_massages;
      if (!dialogsByReceiver[receiverId]) {
        dialogsByReceiver[receiverId] = [];
      }
      dialogsByReceiver[receiverId].push(message);
    });

    // Transforming grouped messages into an array of objects
    const dialogsArray = Object.entries(dialogsByReceiver).map(
      ([receiverId, messages]) => ({
        receiverId,
        messages,
      }),
    );

    return dialogsArray;
  }
}
