import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateProjectDto } from '../dto/create-project.dto';

describe('CreateProjectDto', () => {
  it('deve passar validação com dados corretos', async () => {
    const dto = plainToInstance(CreateProjectDto, {
      name: 'Projeto Teste',
      description: 'Descrição do projeto',
      progress: 50,
      metrics: {
        agility: 10,
        enchantment: 20,
        efficiency: 30,
        excellence: 40,
        transparency: 50,
        ambition: 60,
      },
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('deve falhar sem nome', async () => {
    const dto = plainToInstance(CreateProjectDto, {
      description: 'Descrição',
      progress: 50,
      metrics: {
        agility: 10,
        enchantment: 20,
        efficiency: 30,
        excellence: 40,
        transparency: 50,
        ambition: 60,
      },
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('deve falhar com progresso inválido', async () => {
    const testCases = [
      { progress: -1, expectedError: 'min' },
      { progress: 101, expectedError: 'max' },
      { progress: 'not a number', expectedError: 'isNumber' },
    ];

    for (const testCase of testCases) {
      const dto = plainToInstance(CreateProjectDto, {
        name: 'Projeto',
        description: 'Descrição',
        progress: testCase.progress,
        metrics: {
          agility: 10,
          enchantment: 20,
          efficiency: 30,
          excellence: 40,
          transparency: 50,
          ambition: 60,
        },
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty(testCase.expectedError);
    }
  });

  it('deve falhar com métricas incompletas', async () => {
    const dto = plainToInstance(CreateProjectDto, {
      name: 'Projeto',
      description: 'Descrição',
      progress: 50,
      metrics: {
        agility: 10,
        // enchantment está faltando
        efficiency: 10,
        excellence: 10,
        transparency: 10,
        ambition: 10,
      },
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('metrics');
  });
});
