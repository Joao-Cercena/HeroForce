import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { User } from '../users/user.entity';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async findAll(
    status?: string,
    heroId?: string,
    user?: any,
  ): Promise<Project[]> {
    const query = this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.hero', 'hero');

    if (!user.isAdmin) {
      query.andWhere('hero.id = :userId', { userId: user.id });
    }

    if (status) {
      query.andWhere('project.status = :status', { status });
    }

    if (heroId && user.isAdmin) {
      query.andWhere('hero.id = :heroId', { heroId });
    }

    return await query.getMany();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['hero'],
    });

    if (!project) {
      throw new NotFoundException(`Projeto com ID ${id} não encontrado`);
    }

    return project;
  }

  async create(
    createProjectDto: CreateProjectDto,
    heroId: string,
  ): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      hero: { id: heroId },
    });
    return this.projectsRepository.save(project);
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.projectsRepository.findOne({ where: { id } });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }

    Object.assign(project, updateProjectDto);

    return this.projectsRepository.save(project);
  }

  async remove(id: string): Promise<void> {
    const project = await this.projectsRepository.findOne({ where: { id } });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }

    await this.projectsRepository.remove(project);
  }
}
