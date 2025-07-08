import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('deve criar um usuário com senha criptografada', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
        heroName: 'Spider-Man',
        heroImage: 'https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/images/sm/620-spider-man.jpg',
      };

      const mockUser = {
        ...createUserDto,
        id: '1',
        password: 'hashedPassword',
        isAdmin: false,
      };

      jest.spyOn(repository, 'create').mockReturnValue(mockUser as User);
      jest.spyOn(repository, 'save').mockResolvedValue(mockUser as User);
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashedPassword');

      const result = await service.create(createUserDto);

      expect(bcrypt.hashSync).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(repository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword',
      });
      expect(repository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findOneByEmail', () => {
    it('deve retornar um usuário pelo email', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        heroName: 'Spider-Man',
        heroImage: 'https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/images/sm/620-spider-man.jpg',
        isAdmin: false,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser as User);

      const result = await service.findOneByEmail('test@example.com');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(result).toEqual(mockUser);
    });

    it('deve retornar null quando usuário não for encontrado', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.findOneByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findAllHeroes', () => {
    it('deve retornar todos os heróis com apenas id, name e heroName', async () => {
      const mockUsers = [
        { id: '1', name: 'Hero 1', heroName: 'Spider-Man' },
        { id: '2', name: 'Hero 2', heroName: 'Iron Man' },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(mockUsers as User[]);

      const result = await service.findAllHeroes();

      expect(repository.find).toHaveBeenCalledWith({ select: ['id', 'name', 'heroName'] });
      expect(result).toEqual(mockUsers);
      expect(result[0]).toHaveProperty('heroName');
      expect(result[0]).not.toHaveProperty('password');
      expect(result[0]).not.toHaveProperty('email');
    });
  });
});