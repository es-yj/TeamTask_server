import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GoogleRequest } from './dto/googleuser.dto';
import { UserRepository } from 'src/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async googleLogin(req: GoogleRequest) {
    try {
      const user = await this.findOrCreateUser(req);
      const googleJwt = this.generateJwtToken(user);

      return googleJwt;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('로그인 처리에 실패했습니다.');
    }
  }

  private async findOrCreateUser(req: GoogleRequest) {
    const { email, name, picture } = req.user;
    let user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      const newUser = { email, name, picture };
      user = await this.userRepository.createUser(newUser);
    }

    return user;
  }

  private generateJwtToken(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      }),
    };
  }
}
