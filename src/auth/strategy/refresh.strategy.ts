import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refreshToken;
        },
      ]),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.cookies['refreshToken'];
    const user: User = await this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.sub,
    );
    return user;
  }
}
