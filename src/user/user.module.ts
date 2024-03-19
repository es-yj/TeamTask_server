import { Module } from '@nestjs/common';
// import { UserService } from './user.service';
// import { UserController } from './user.controller'
import { TypeOrmExModule } from 'src/common/typeorm-custom.module';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserRepository])],
  controllers: [],
  providers: [UserService],
  exports: [TypeOrmExModule, UserService],
})
export class UserModule {}
