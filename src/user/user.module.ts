import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmExModule } from 'src/common/typeorm-custom.module';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { RefreshStrategy } from 'src/auth/strategy/refresh.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'access' }),
    TypeOrmExModule.forCustomRepository([UserRepository]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmExModule, UserService],
})
export class UserModule {}
