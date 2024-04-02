import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from '../user/user.service';

@Injectable()
export class ScheduleService {
  constructor(private readonly userService: UserService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - 1); // 하루 전 날짜로 설정
    await this.userService.removePendingUsers(threshold);
  }
}
