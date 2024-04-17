import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { TypeOrmExModule } from 'src/common/typeorm-custom.module';
import { PassportModule } from '@nestjs/passport';
import { ProjectRepository } from './project.repository';
import { UserModule } from 'src/user/user.module';
import { SlackService } from 'src/slack/slack.service';
import { Delivery } from './entities/delivery.entity';
import { Contract } from './entities/contract.entity';
import { ProjectManager } from './entities/project-manager.entity';
import { ProgressDetail } from './entities/progress_detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      Delivery,
      Contract,
      ProjectManager,
      ProgressDetail,
    ]),
    TypeOrmExModule.forCustomRepository([ProjectRepository]),
    PassportModule.register({ defaultStrategy: 'access' }),
    UserModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService, SlackService],
})
export class ProjectModule {}
