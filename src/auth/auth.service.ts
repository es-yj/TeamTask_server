import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto, GoogleRequest } from './dto/googleuser.dto';
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

  async findOrSaveUser(googleReq: GoogleRequest) {
    try {
      const { email } = googleReq.user;
      let user = await this.userRepository.findUserByEmail(email);
      const url = user ? 'http://localhost:3000' : 'http://localhost:3000/team';

      if (!user) {
        user = await this.userRepository.save(googleReq.user);
      }

      return { user, url };
    } catch (error) {
      throw new InternalServerErrorException(
        '사용자 인증 처리 중 오류가 발생했습니다.',
      );
    }
  }

  // 팀과 가입 승인 상태 업데이트
  private async updateUserTeamAndStatus(
    user: User,
    team: number,
    status: string,
  ) {
    user.team = team;
    user.status = status;
    await this.userRepository.save(user);
  }

  getToken(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      status: user.status,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });

    return { accessToken, refreshToken };
  }
}
