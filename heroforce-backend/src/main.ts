import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

    const usersService = app.get(UsersService);
  await seedAdminUser(usersService);
  await app.listen(process.env.PORT ?? 3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();


async function seedAdminUser(usersService: UsersService) {
  const email = 'stan.lee@heroforce.com';
  const existing = await usersService.findOneByEmail(email);

  if (!existing) {
    await usersService.create({
      name: 'Stan Lee',
      email,
      password: 'Excelsior#1962',
      heroCharacter: 'The Watcher',
      isAdmin: true,
    } as any);
    console.log('👤 Usuário admin "Stan Lee" criado!');
  }
}
