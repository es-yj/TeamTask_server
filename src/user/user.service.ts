import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { Project } from 'src/project/entities/project.entity';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  async findAllUsers() {
    try {
      const users = await this.userRepository.findAllUsers();
      return users;
    } catch (error) {
      throw new InternalServerErrorException(
        '유저 목록 반환에 실패했습니다.' + error[0],
      );
    }
  }

  async findUserById(id: number) {
    try {
      const user = await this.userRepository.findUserById(id);

      if (!user) {
        throw new NotFoundException('해당 id의 유저를 찾을 수 없습니다.');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        '유저 반환에 실패했습니다.' + error[0],
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

  // 사용자가 담당하는 프로젝트 조회
  async findProjectsByUserId(userId: number): Promise<Project[]> {
    const userWithProjects =
      await this.userRepository.findProjectsByUserId(userId);

    if (!userWithProjects) {
      return [];
    }

    return userWithProjects;
  }

  // async refreshTokenMatches(refreshToken: string, id: number): Promise<User> {
  //   const user = await this.findUserById(id);

  //   const isMatches = this.isMatch(refreshToken, user.refreshToken);
  //   if (isMatches) return user;
  // }
}
