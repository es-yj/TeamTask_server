import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmExModule } from 'src/common/typeorm-custom.module';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'access' }),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    TypeOrmModule.forFeature([Team]),
    ScheduleModule.forRoot(),
  ],
  controllers: [UserController],
  providers: [UserService, ScheduleService],
  exports: [TypeOrmExModule, UserService],
})
export class UserModule {}
