import { Module } from '@nestjs/common';
import { UserService } from './user.service';
// import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmExModule } from 'src/utils/typeorm-custom.module';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserRepository])],
  controllers: [],
  providers: [UserService],
  exports: [TypeOrmExModule, UserService],
})
export class UserModule {}
