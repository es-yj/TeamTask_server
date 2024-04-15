import { Repository } from 'typeorm';
import { CustomRepository } from 'src/common/decorators/typeorm-repository.decorator';
import { User } from './entities/user.entity';
import { Project } from 'src/project/entities/project.entity';
import { CreateUserDto, GoogleUser } from 'src/auth/dto/googleuser.dto';
import { UpdateTeamInfoDto } from 'src/auth/dto/update-team-info.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  private async findByCondition(condition: any): Promise<User | null> {
    return await this.findOne({ where: condition });
  }
  async findByField(fieldName: string, value: any): Promise<User | null> {
    return this.findByCondition({ [fieldName]: value });
  }

  async signUp(createUserDto: CreateUserDto): Promise<void> {
    await this.save(createUserDto);
  }

  async findUserById(id: number): Promise<User | null> {
    return await this.findOne({
      select: [
        'id',
        'name',
        'email',
        'picture',
        'team',
        'role',
        'status',
        'createdAt',
        'updatedAt',
      ],
      where: { id },
    });
  }

  async findUserByIdWithToken(id: number): Promise<User | null> {
    const user = await this.findOne({
      where: { id },
    });
    return user;
  }

  async findProjectsByUserId(id: number): Promise<Project[]> {
    const userWithProjects = await this.findOne({
      where: { id },
      relations: ['projects'],
    });

    if (userWithProjects) {
      return userWithProjects.projects;
    }
    return null;
  }

  async updateUserTeamInfo(
    userId: number,
    updateTeamInfoDto: UpdateTeamInfoDto,
  ): Promise<void> {
    await this.update(userId, updateTeamInfoDto);
  }

  async updateUser(userId: number, updateUserDto: object): Promise<void> {
    await this.update(userId, updateUserDto);
  }

  async findUsersByTeam(teamId?: string): Promise<User[]> {
    const condition = teamId ? { team: teamId } : {};
    return this.find({
      select: [
        'id',
        'name',
        'email',
        'picture',
        'team',
        'role',
        'status',
        'createdAt',
        'updatedAt',
      ],
      where: condition,
    });
  }

  async removePendingUsers(threshold: Date) {
    this.createQueryBuilder()
      .delete()
      .from(User)
      .where('status = :status', { status: 'pending' })
      .andWhere('created_at<:threshold', { threshold })
      .andWhere('team is NULL')
      .execute();
  }

  async findPendingUsers(teamId?: string): Promise<User[]> {
    const condition = { status: 'pending', ...(teamId && { team: teamId }) };
    return this.find({
      where: condition,
      select: [
        'id',
        'name',
        'email',
        'picture',
        'team',
        'status',
        'createdAt',
        'updatedAt',
      ],
    });
  }
}
