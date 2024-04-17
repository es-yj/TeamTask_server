import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategy/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshStrategy } from './strategy/refresh.strategy';
import { SseService } from 'src/sse/sse.service';
import { SseController } from 'src/sse/sse.controller';

@Module({
  imports: [
    UserModule,
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'access' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SseService,
    GoogleStrategy,
    JwtStrategy,
    RefreshStrategy,
  ],
})
export class AuthModule {}
