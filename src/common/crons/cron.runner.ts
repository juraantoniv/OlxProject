import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GoodsRepository } from '../../modules/goods/goods.repository';
import { UserRepository } from '../../modules/user/user.repository';
import { EmailService } from '../services/email.service';
import { EActive } from '../enums/valiid.enum';
import { checkWordsService } from '../services/check.worlds.service';
import { EEmailAction } from '../enums/email.action.enum';

@Injectable()
export class TasksService {
  constructor(
    private goodsRepository: GoodsRepository,
    private userRepository: UserRepository,
    private emailService: EmailService,
  ) {}
  @Cron(CronExpression.EVERY_2_HOURS)
  public async checkWorlds() {
    const goods = await this.goodsRepository.getAllGoods();

    goods.map(async (good) => {
      const user = await this.userRepository.findOneBy({ id: good.user_id });

      if (good.active === EActive.Nonactive) {
        const valid = checkWordsService.check(good.description);
        if (!valid && good.check_of_valid <= 3) {
          await this.emailService.send(
            user.email,
            EEmailAction.Change_Advertising,
            {
              name: user.name,
              title: good.title,
            },
          );
        } else {
          await this.goodsRepository.save({ ...good, active: EActive.Active });
        }
      }
    });
  }
}
