import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { Project } from 'src/project/entities/project.entity';
import { UpdateUserDto, UpdateUserStatusDto } from './dto/update-user.dto';
import { Team } from './entities/team.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Role } from './enum/roles.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(Team) private teamRepository: Repository<Team>,
    private readonly configService: ConfigService,
  ) {}

  async findUserById(id: number) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotFoundException('해당 id의 유저를 찾을 수 없습니다.');
    }
    return user;
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('해당 id의 유저를 찾을 수 없습니다.');
    }

    await this.userRepository.updateUser(userId, updateUserDto);
    return { msg: '사용자 정보 수정에 성공했습니다.' };
  }

  async updateUserStatus(
    updateUserId: number,
    updateUserStatusDto: UpdateUserStatusDto,
    managerId: number,
  ) {
    const updateUser = await this.userRepository.findUserById(updateUserId);
    const manager = await this.userRepository.findUserById(managerId);

    this.validateUserStatus(updateUser);
    this.validateManagerRole(manager, updateUser);

    await this.userRepository.updateUser(updateUserId, updateUserStatusDto);
    return { msg: '사용자 승인/거절에 성공했습니다.' };
  }

  // 사용자가 담당하는 프로젝트 조회
  async findProjectsByUserId(userId: number): Promise<Project[]> {
    const userWithProjects =
      await this.userRepository.findProjectsByUserId(userId);

    if (!userWithProjects) {
      return [];
    }

    return userWithProjects;
  }

  async getUsersByTeam(teamId?: string) {
    return await this.userRepository.findUsersByTeam(teamId);
  }

  async removePendingUsers(threshold: Date) {
    await this.userRepository.removePendingUsers(threshold);
  }

  async getTeamManagers(teamId: string) {
    const result = await this.teamRepository
      .createQueryBuilder('team')
      .select('user.id', 'tmId') // "user.id"를 "tmId"라는 별칭으로 선택
      .addSelect('user.name', 'tmName')
      .innerJoin('team.tm', 'user') // "team" 엔터티의 "tm" 필드에 해당하는 "user" 테이블과 조인
      .where('team.team = :teamId', { teamId }) // 바인딩된 변수를 사용하여 SQL 인젝션 방지
      .getRawOne(); // Raw 결과 가져오기

    return result ? result : null; // 결과가 있으면 tmId 반환, 없으면 null 반환
  }

  async findPendingUsers(userId: number): Promise<User[]> {
    const user = await this.findUserById(userId);
    if (!userId) {
      throw new NotFoundException('해당 id를 가진 사용자를 찾을 수 없습니다.');
    }

    if (user.role === Role.TM) {
      return await this.userRepository.findPendingUsers(user.team);
    }
    return await this.userRepository.findPendingUsers();
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

  private validateUserStatus(user: User) {
    if (user.status != 'pending') {
      throw new ConflictException('이미 승인 또는 거절된 사용자입니다.');
    }
  }

  private validateManagerRole(manager: User, user: User) {
    if (manager.role == Role.TM && user.team !== manager.team) {
      throw new UnauthorizedException(
        'TM은 속한 팀의 사용자만 승인할 수 있습니다.',
      );
    }
  }
}
