import { Repository } from 'typeorm';
import { CustomRepository } from 'src/common/decorators/typeorm-repository.decorator';
import { User } from './entities/user.entity';
import { Project } from 'src/project/entities/project.entity';
import { CreateUserDto, GoogleUser } from 'src/auth/dto/googleuser.dto';
import { UpdateTeamInfoDto } from 'src/auth/dto/update-team-info.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async findByField(fieldName: string, value: any): Promise<User> {
    const query = {};
    query[fieldName] = value;

    const user = await this.findOne({ where: query });
    return user;
  }

  async signUp(createUserDto: CreateUserDto): Promise<void> {
    await this.save(createUserDto);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.findOne({ where: { email } });
    return user;
  }

  async createUser(newUser: GoogleUser): Promise<User> {
    const user = await this.save(newUser);
    return user;
  }

  async findAllUsers(): Promise<User[] | null> {
    const users = await this.find();
    return users;
  }

  async findUserById(id: number): Promise<User | null> {
    const user = await this.findOne({ where: { id } });
    return user;
  }

  async findProjectsByUserId(id: number): Promise<Project[]> {
    const userWithProjects = await this.findOne({
      where: { id },
      relations: ['projects'],
    });

    return userWithProjects.projects;
  }

  async updateUserTeamInfo(
    userId: number,
    updateTeamInfoDto: UpdateTeamInfoDto,
  ): Promise<void> {
    await this.update(userId, updateTeamInfoDto);
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    await this.update(userId, updateUserDto);
  }

  async findUsersByTeam(teamId: number): Promise<User[]> {
    if (teamId) {
      return this.find({ where: { team: teamId } });
    }

    return this.find();
  }
}
