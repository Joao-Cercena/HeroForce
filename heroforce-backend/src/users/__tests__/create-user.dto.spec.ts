import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from '../dto/create-user.dto';

describe('CreateUserDto', () => {
  it('deve passar validação com dados corretos', async () => {
    const dto = plainToInstance(CreateUserDto, {
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
      heroName: 'Spider-Man',
      heroImage:
        'https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/images/sm/620-spider-man.jpg',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('deve falhar sem nome', async () => {
    const dto = plainToInstance(CreateUserDto, {
      email: 'test@example.com',
      password: '123456',
      heroName: 'Spider-Man',
      heroImage:
        'https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/images/sm/620-spider-man.jpg',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('deve falhar com email inválido', async () => {
    const dto = plainToInstance(CreateUserDto, {
      name: 'Test User',
      email: 'not-an-email',
      password: '123456',
      heroName: 'Spider-Man',
      heroImage:
        'https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/images/sm/620-spider-man.jpg',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('deve falhar com senha curta', async () => {
    const dto = plainToInstance(CreateUserDto, {
      name: 'Test User',
      email: 'test@example.com',
      password: '123',
      heroName: 'Spider-Man',
      heroImage:
        'https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/images/sm/620-spider-man.jpg',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('minLength');
  });

  it('deve falhar sem herói favorito', async () => {
    const dto = plainToInstance(CreateUserDto, {
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });
});
