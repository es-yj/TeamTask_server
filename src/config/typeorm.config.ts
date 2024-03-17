import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export function TypeormConfig(configService: ConfigService) {
  const option: TypeOrmModuleOptions = {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: parseInt(configService.get<string>('DB_PORT')),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: configService.get<boolean>('DB_SYNCHRONIZE') || false,
    namingStrategy: new SnakeNamingStrategy(),
    logging: false,
  };
  console.log(option);
  return option;
}

// export const typeORMConfig = async (
//   configService: ConfigService,
// ): Promise<TypeOrmModuleOptions> => {
//   return {
//     type: 'postgres',
//     host: configService.get<string>('DB_HOST') || 'localhost',
//     port: parseInt(configService.get<string>('DB_PORT')) || 5432,
//     username: configService.get<string>('DB_USERNAME') || 'postgres',
//     password: configService.get<string>('DB_PASSWORD') || '1234',
//     database: configService.get<string>('DB_DATABASE') || 'postgres',
//     entities: [__dirname + '/../**/*.entity.{js,ts}'],
//     synchronize: configService.get<boolean>('DB_SYNCHRONIZE') || false,
//     namingStrategy: new SnakeNamingStrategy(),
//     logging: false,
//   };
// };
