import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NotFoundFilter } from './not-found.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new NotFoundFilter());
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('HeroForce API')
    .setDescription('Documentação da API da HeroForce')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const usersService = app.get(UsersService);
  await seedAdminUser(usersService);
  await seedMyHero(usersService);
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
      heroName: 'Spider-Man',
      heroImage:
        'https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/images/sm/620-spider-man.jpg',
      isAdmin: true,
    } as any);
    console.log('👤 Usuário admin "Stan Lee" criado!');
  }
}

async function seedMyHero(usersService: UsersService) {
  const email = 'joao.cercena@heroforce.com';
  const existing = await usersService.findOneByEmail(email);

  if (!existing) {
    await usersService.create({
      name: 'João Vitor Cercená',
      email,
      password: '123456',
      heroName: 'Donatello',
      heroImage:
        'https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/images/sm/228-donatello.jpg',
      isAdmin: false,
    } as any);
    console.log('👤 Personagem escolhido!');
  }
}
