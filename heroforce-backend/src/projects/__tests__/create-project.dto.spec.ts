import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateProjectDto } from '../dto/create-project.dto';

describe('CreateProjectDto', () => {
  const validDto = {
    name: 'Projeto Teste',
    description: 'Descrição do projeto',
    progress: 50,
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

  it('deve passar validação com dados corretos', async () => {
    const dto = plainToInstance(CreateProjectDto, validDto);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('deve falhar quando o nome estiver ausente', async () => {
    const { name, ...partialDto } = validDto;
    const dto = plainToInstance(CreateProjectDto, partialDto);
    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('deve falhar com valores inválidos de progresso', async () => {
    const invalidProgressCases = [
      { progress: -5, expectedError: 'min' },
      { progress: 150, expectedError: 'max' },
      { progress: 'não é número', expectedError: 'isNumber' },
    ];

    for (const test of invalidProgressCases) {
      const dto = plainToInstance(CreateProjectDto, {
        ...validDto,
        progress: test.progress,
      });

      const errors = await validate(dto);
      const progressError = errors.find((e) => e.property === 'progress');

      expect(progressError).toBeDefined();
      expect(progressError?.constraints).toHaveProperty(test.expectedError);
    }
  });

  it('deve falhar quando alguma métrica estiver ausente', async () => {
    const { metrics, ...rest } = validDto;
    const { enchantment, ...partialMetrics } = metrics;

    const dto = plainToInstance(CreateProjectDto, {
      ...rest,
      metrics: partialMetrics,
    });

    const errors = await validate(dto);
    const metricsError = errors.find((e) => e.property === 'metrics');

    expect(metricsError).toBeDefined();
  });

  it('deve falhar quando o status for inválido', async () => {
    const dto = plainToInstance(CreateProjectDto, {
      ...validDto,
      status: 'invalido',
    });

    const errors = await validate(dto);
    const statusError = errors.find((e) => e.property === 'status');

    expect(statusError).toBeDefined();
    expect(statusError?.constraints).toHaveProperty('isIn');
  });
});
