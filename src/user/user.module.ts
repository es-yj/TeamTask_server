import { Module } from '@nestjs/common';
// import { UserService } from './user.service';
// import { UserController } from './user.controller'
import { TypeOrmExModule } from 'src/utils/typeorm-custom.module';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserRepository])],
  controllers: [],
  providers: [],
  exports: [TypeOrmExModule],
})
export class UserModule {}
