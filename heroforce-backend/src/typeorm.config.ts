import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

function mustEnv(key: string): string {
  const value = process.env[key];
  console.log(key + ' : ' + value);
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: mustEnv('DATABASE_URL'),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,
};
