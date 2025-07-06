import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    usersService = {
      findOneByEmail: jest.fn().mockResolvedValue({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: false,
        heroName: 'Spider-Man',
        heroImage: 'https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/images/sm/620-spider-man.jpg',
      }),
    };

    const jwtServiceMock = {
      sign: jest.fn().mockReturnValue('mock-token'),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('deve fazer login com credenciais corretas', async () => {
    const result = await service.validateUser('test@example.com', '123456');
    expect(result).toBeDefined();
    expect(result.email).toBe('test@example.com');
  });

  it('deve falhar com senha errada', async () => {
    const result = await service.validateUser(
      'test@example.com',
      'senhaerrada',
    );
    expect(result).toBeNull();
  });
});
