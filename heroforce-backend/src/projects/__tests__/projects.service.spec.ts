import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../project.entity';
import { ProjectsService } from '../projects.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { User } from '../../users/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let projectRepository: Repository<Project>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getMany: jest.fn(),
            })),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    projectRepository = module.get<Repository<Project>>(
      getRepositoryToken(Project),
    );
  });

  describe('findAll', () => {
    it('deve retornar todos projetos para admin', async () => {
      const mockProjects = [{ id: '1', name: 'Project 1' }];
      jest.spyOn(projectRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockProjects),
      } as any);

      const result = await service.findAll(undefined, undefined, {
        isAdmin: true,
      });
      expect(result).toEqual(mockProjects);
    });

    it('deve filtrar por status', async () => {
      const mockProjects = [
        { id: '1', name: 'Project 1', status: 'emandamento' },
      ];
      jest.spyOn(projectRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockProjects),
      } as any);

      const result = await service.findAll('emandamento', undefined, {
        isAdmin: true,
      });
      expect(result).toEqual(mockProjects);
    });

    it('deve filtrar por heroId apenas para admin', async () => {
      const mockProjects = [
        { id: '1', name: 'Project 1', hero: { id: 'hero-1' } },
      ];
      jest.spyOn(projectRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockProjects),
      } as any);

      const result = await service.findAll(undefined, 'hero-1', {
        isAdmin: true,
      });
      expect(result).toEqual(mockProjects);
    });

    it('deve retornar apenas projetos do usuário quando não for admin', async () => {
      const mockProjects = [
        { id: '1', name: 'Project 1', hero: { id: 'user-1' } },
      ];
      jest.spyOn(projectRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockProjects),
      } as any);

      const result = await service.findAll(undefined, undefined, {
        isAdmin: false,
        id: 'user-1',
      });
      expect(result).toEqual(mockProjects);
    });
  });

  describe('findOne', () => {
    it('deve retornar um projeto existente', async () => {
      const mockProject = { id: '1', name: 'Project 1' };
      jest
        .spyOn(projectRepository, 'findOne')
        .mockResolvedValue(mockProject as Project);

      const result = await service.findOne('1');
      expect(result).toEqual(mockProject);
    });

    it('deve lançar NotFoundException para projeto inexistente', async () => {
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
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
        .spyOn(projectRepository, 'create')
        .mockReturnValue(mockProject as Project);
      jest
        .spyOn(projectRepository, 'save')
        .mockResolvedValue(mockProject as Project);

      const result = await service.create(createProjectDto, 'hero-1');
      expect(result).toEqual(mockProject);
      expect(projectRepository.create).toHaveBeenCalledWith({
        ...createProjectDto,
        hero: { id: 'hero-1' },
      });
    });
  });

  describe('update', () => {
    it('deve atualizar um projeto existente', async () => {
      const existingProject = {
        id: '1',
        name: 'Old Name',
        description: 'Old Description',
        progress: 0,
        metrics: {
          agility: 0,
          enchantment: 0,
          efficiency: 0,
          excellence: 0,
          transparency: 0,
          ambition: 0,
        },
      };

      const updateData = {
        name: 'Updated Name',
        progress: 50,
      };

      const updatedProject = {
        ...existingProject,
        ...updateData,
      };

      jest
        .spyOn(projectRepository, 'findOne')
        .mockResolvedValue(existingProject as Project);
      jest
        .spyOn(projectRepository, 'save')
        .mockResolvedValue(updatedProject as Project);

      const result = await service.update('1', updateData);
      expect(result).toEqual(updatedProject);
    });

    it('deve lançar NotFoundException ao tentar atualizar projeto inexistente', async () => {
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update('999', { name: 'Updated' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deve remover um projeto existente', async () => {
      const mockProject = { id: '1', name: 'Project 1' };

      jest
        .spyOn(projectRepository, 'findOne')
        .mockResolvedValue(mockProject as Project);

      const removeSpy = jest
        .spyOn(projectRepository, 'remove')
        .mockResolvedValue(undefined as any);

      await expect(service.remove('1')).resolves.toBeUndefined();
      expect(removeSpy).toHaveBeenCalledWith(mockProject);
    });

    it('deve lançar NotFoundException se o projeto não existir', async () => {
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
