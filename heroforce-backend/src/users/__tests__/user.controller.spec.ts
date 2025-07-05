import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../user.controller';
import { UsersService } from '../users.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Partial<UsersService>;

  const mockAuthGuard = {
    canActivate: (context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();
      request.user = { userId: '1', email: 'test@example.com' };
      return true;
    },
  };

  beforeEach(async () => {
    usersService = {
      findAllHeroes: jest.fn().mockResolvedValue([
        { id: '1', name: 'Hero 1' },
        { id: '2', name: 'Hero 2' },
      ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersService },
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('findAll', () => {
    it('deve retornar uma lista de heróis', async () => {
      const result = await controller.findAll();
      expect(usersService.findAllHeroes).toHaveBeenCalled();
      expect(result).toEqual([
        { id: '1', name: 'Hero 1' },
        { id: '2', name: 'Hero 2' },
      ]);
    });
  });
});