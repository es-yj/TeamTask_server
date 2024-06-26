import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleRequest } from './dto/googleuser.dto';
import { UserRepository } from 'src/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { UpdateTeamInfoDto } from './dto/update-team-info.dto';
import { UserService } from 'src/user/user.service';
import { SseService } from 'src/sse/sse.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly sseService: SseService,
  ) {}

  async findOrSaveUser(googleReq: GoogleRequest) {
    try {
      const { email } = googleReq.user;
      let user = await this.userRepository.findByField('email', email);
      const url = user
        ? 'http://localhost:3000/'
        : 'http://localhost:3000/account/team/';

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

  async updateTeamInfo(userId, updateTeamInfoDto: UpdateTeamInfoDto) {
    const { team } = updateTeamInfoDto;

    const newUser = await this.userService.findUserById(userId);
    const manager = await this.userService.getTeamManagers(team);
    if (manager) {
      await this.sseService.notifyTeamManagers(manager.tmId, {
        message: `${newUser.name}님이 ${team}팀 승인을 요청했습니다.`,
      });
    }
    return await this.userRepository.updateUserTeamInfo(
      userId,
      updateTeamInfoDto,
    );
  }

  async generateAccessToken(user: User): Promise<string> {
    const payload = {
      email: user.email,
      sub: user.id,
      status: user.status,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });
    return accessToken;
  }

  async generateRefreshToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
    };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });
    return refreshToken;
  }
}
