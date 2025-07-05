import { IsNotEmpty, IsNumber, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MetricsDto } from './metrics.dto';

export class CreateProjectDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;

  @ValidateNested()
  @Type(() => MetricsDto)
  metrics: MetricsDto;
}
