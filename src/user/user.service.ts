import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { Project } from 'src/project/entities/project.entity';

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

  // 사용자가 담당하는 프로젝트 조회
  async findProjectsByUserId(userId: number): Promise<Project[]> {
    const userWithProjects =
      await this.userRepository.findProjectsByUserId(userId);

    if (!userWithProjects) {
      return [];
    }

    return userWithProjects;
  }
}
