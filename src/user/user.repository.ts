import { Repository } from 'typeorm';
import { CustomRepository } from 'src/utils/typeorm-repository.decorator';
import { User } from './entities/user.entity';
import { GoogleUser } from 'src/auth/dto/googleuser.dto';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async findByField(fieldName: string, value: any): Promise<User> {
    const query = {};
    query[fieldName] = value;

    const user = await this.findOne({ where: query });
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.findOne({ where: { email } });
    return user;
  }

  async createUser(newUser: GoogleUser): Promise<User> {
    const user = await this.save(newUser);
    return user;
  }
}
