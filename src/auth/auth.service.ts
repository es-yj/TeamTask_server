import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
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

  async googleLogin(req: GoogleRequest) {
    try {
      // const user = await this.findOrCreateUser(req);
      const { email } = req.user;
      let user = await this.userRepository.findUserByEmail(email);

      // 가입되지 않은 사용자라면 클라이언트에 유저 정보 반환
      if (!user) {
        return { msg: '새로운 사용자입니다.', user: req.user };
      }

      // 가입된 사용자라면 Jwt 토큰, 승인 상태 반환
      const googleJwt = this.generateJwtToken(user);
      const { status } = user;
      return { accessToken: googleJwt, status };
    } catch (error) {
      throw new UnauthorizedException('로그인 처리에 실패했습니다.');
    }
  }

  async signUp(createUserDto: CreateUserDto) {
    try {
      await this.userRepository.signUp(createUserDto);
    } catch (error) {
      throw new InternalServerErrorException('회원가입에 실패하였습니다.');
    }
  }

  private async findOrCreateUser(req: GoogleRequest) {
    const { email, name, picture } = req.user;
    let user = await this.userRepository.findUserByEmail(email);

    // DB에 사용자가 없으면 새로 생성
    if (!user) {
      const newUser = { email, name, picture };
      user = await this.userRepository.createUser(newUser);
    }

    return user;
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

  private generateJwtToken(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: Number(
        this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      ),
    });

    return accessToken;
  }
}
