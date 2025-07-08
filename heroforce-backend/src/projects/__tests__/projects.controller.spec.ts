import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from '../projects.controller';
import { ProjectsService } from '../projects.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminGuard } from '../../auth/admin.guard';
import { ExecutionContext, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CreateProjectDto } from '../dto/create-project.dto';
import { Project } from '../project.entity';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { Request } from 'express';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let projectsService: ProjectsService;

  const mockAuthGuard = {
    canActivate: (context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();
      request.user = { userId: '1', email: 'test@example.com', isAdmin: true };
      return true;
    },
  };

  const mockAdminGuard = {
    canActivate: (context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();
      request.user = { ...request.user, isAdmin: true };
      return true;
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
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
      .overrideGuard(AdminGuard)
      .useValue(mockAdminGuard)
      .compile();

    controller = module.get<ProjectsController>(ProjectsController);
    projectsService = module.get<ProjectsService>(ProjectsService);
  });

  describe('findAll', () => {
    it('deve retornar lista de projetos', async () => {
      const mockProjects = [{ id: '1', name: 'Project 1' }];
      jest
        .spyOn(projectsService, 'findAll')
        .mockResolvedValue(mockProjects as Project[]);

      const mockReq = { user: { isAdmin: true } } as Partial<Request>;
      const result = await controller.findAll(
        undefined,
        undefined,
        mockReq as Request,
      );
      expect(result).toEqual(mockProjects);
    });

    it('deve filtrar por status', async () => {
      const mockProjects = [
        { id: '1', name: 'Project 1', status: 'concluido' },
      ];
      jest
        .spyOn(projectsService, 'findAll')
        .mockResolvedValue(mockProjects as Project[]);

      const mockReq = { user: { isAdmin: true } } as Partial<Request>;
      const result = await controller.findAll(
        'concluido',
        undefined,
        mockReq as Request,
      );
      expect(result).toEqual(mockProjects);
    });

    it('deve filtrar por heroId', async () => {
      const mockProjects = [
        { id: '1', name: 'Project 1', hero: { id: 'hero-1' } },
      ];
      jest
        .spyOn(projectsService, 'findAll')
        .mockResolvedValue(mockProjects as Project[]);

      const mockReq = { user: { isAdmin: true } } as Partial<Request>;
      const result = await controller.findAll(
        undefined,
        'hero-1',
        mockReq as Request,
      );
      expect(result).toEqual(mockProjects);
    });
  });

  describe('findOne', () => {
    it('deve retornar um projeto', async () => {
      const mockProject = { id: '1', name: 'Project 1' };
      jest
        .spyOn(projectsService, 'findOne')
        .mockResolvedValue(mockProject as Project);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockProject);
    });
  });

  describe('create', () => {
    it('deve criar um novo projeto', async () => {
      const createProjectDto: CreateProjectDto = {
        name: 'New Project',
        description: 'Description',
        progress: 0,
        status: 'pendente',
        hero: 'hero-1',
        metrics: {
          agility: 10,
          enchantment: 20,
          efficiency: 30,
          excellence: 40,
          transparency: 50,
          ambition: 60,
        },
      };

      const mockProject = {
        ...createProjectDto,
        id: '1',
        hero: { id: 'hero-1' },
      };

      jest
        .spyOn(projectsService, 'create')
        .mockResolvedValue(mockProject as Project);

      const result = await controller.create(createProjectDto, {
        body: { hero: 'hero-1' },
      } as any);
      expect(result).toEqual(mockProject);
    });
  });

  describe('update', () => {
    it('deve atualizar um projeto', async () => {
      const updateProjectDto: UpdateProjectDto = {
        name: 'Updated Project',
        progress: 50,
      };

      const mockProject = {
        id: '1',
        name: 'Updated Project',
        description: 'Description',
        progress: 50,
        metrics: {
          agility: 10,
          enchantment: 20,
          efficiency: 30,
          excellence: 40,
          transparency: 50,
          ambition: 60,
        },
      };

      jest
        .spyOn(projectsService, 'update')
        .mockResolvedValue(mockProject as Project);

      const result = await controller.update('1', updateProjectDto);
      expect(result).toEqual(mockProject);
    });
  });

  describe('remove', () => {
    it('deve remover um projeto', async () => {
      const removeSpy = jest
        .spyOn(projectsService, 'remove')
        .mockResolvedValue(undefined);

      const result = await controller.remove('1');
      expect(result).toBeUndefined();
      expect(removeSpy).toHaveBeenCalledWith('1');
    });

    it('deve lançar exceção se o service lançar', async () => {
      jest
        .spyOn(projectsService, 'remove')
        .mockRejectedValue(new NotFoundException('Projeto não encontrado'));

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
