import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { Project } from 'src/project/entities/project.entity';
import { UpdateUserDto, UpdateUserStatusDto } from './dto/update-user.dto';
import { Team } from './entities/team.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(Team) private teamRepository: Repository<Team>,
    private readonly configService: ConfigService,
  ) {}

  async findUserById(id: number) {
    try {
      const user = await this.userRepository.findUserById(id);

      if (!user) {
        throw new NotFoundException('해당 id의 유저를 찾을 수 없습니다.');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        '유저 반환에 실패했습니다.' + error.message,
      );
    }
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new NotFoundException('해당 id의 유저를 찾을 수 없습니다.');
      }

      await this.userRepository.updateUser(userId, updateUserDto);
      return { msg: '사용자 정보 수정에 성공했습니다.' };
    } catch (error) {
      throw new InternalServerErrorException(
        '사용자 정보 수정에 실패하였습니다.',
      );
    }
  }

  async updateUserStatus(
    userId: number,
    updateUserStatusDto: UpdateUserStatusDto,
  ) {
    try {
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new NotFoundException('해당 id의 유저를 찾을 수 없습니다.');
      }

      if (user.status != 'pending') {
        throw new ConflictException('이미 승인 또는 거절된 사용자입니다.');
      }

      await this.userRepository.updateUser(userId, updateUserStatusDto);
      return { msg: '사용자 승인/거절에 성공했습니다.' };
    } catch (error) {
      if (error instanceof NotFoundException || ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        '사용자 승인/거절에 실패하였습니다.',
      );
    }
  }

  // 사용자가 담당하는 프로젝트 조회
  async findProjectsByUserId(userId: number): Promise<Project[]> {
    try {
      const userWithProjects =
        await this.userRepository.findProjectsByUserId(userId);

      if (!userWithProjects) {
        return [];
      }

      return userWithProjects;
    } catch (error) {
      throw new InternalServerErrorException(
        '사용자의 프로젝트 목록 조회에 실패하였습니다.',
      );
    }
  }

  async getUsersByTeam(teamId?: number) {
    try {
      // if (teamId) {
      //   const team = await this.teamRepository.findOne({
      //     where: { team: teamId },
      //   });
      //   if (!team) {
      //     throw new NotFoundException('해당 id의 팀을 찾을 수 없습니다.');
      //   }
      // }
      return await this.userRepository.findUsersByTeam(teamId);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        '유저 목록 반환에 실패하였습니다.',
      );
    }
  }

  // 해시화된 refresh token 저장
  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentRefreshToken =
      await this.getCurrentHashedRefreshToken(refreshToken);
    const currentRefreshTokenExp = await this.getCurrentRefreshTokenExp();
    await this.userRepository.update(userId, {
      currentRefreshToken: currentRefreshToken,
      currentRefreshTokenExp: currentRefreshTokenExp,
    });
  }

  async getCurrentHashedRefreshToken(refreshToken: string) {
    const saltOrRounds = 10;
    const currentRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);
    return currentRefreshToken;
  }

  async getCurrentRefreshTokenExp(): Promise<Date> {
    const currentDate = new Date();
    // Date 형식으로 데이터베이스에 저장하기 위해 문자열을 숫자 타입으로 변환 (paresInt)
    const currentRefreshTokenExp = new Date(
      currentDate.getTime() +
        parseInt(
          this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
        ),
    );
    return currentRefreshTokenExp;
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: number,
  ): Promise<User> {
    const user: User = await this.userRepository.findUserByIdWithToken(userId);

    // user에 currentRefreshToken이 없다면 null을 반환 (즉, 토큰 값이 null일 경우)
    if (!user.currentRefreshToken) {
      return null;
    }

    // 유저 테이블 내에 정의된 암호화된 refresh_token값과 요청 시 body에 담아준 refresh_token값 비교
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentRefreshToken,
    );

    // 만약 isRefreshTokenMatching이 true라면 user 객체를 반환
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number): Promise<any> {
    return await this.userRepository.update(userId, {
      currentRefreshToken: null,
      currentRefreshTokenExp: null,
    });
  }

  async removePendingUsers(threshold: Date) {
    await this.userRepository.removePendingUsers(threshold);
  }
}
