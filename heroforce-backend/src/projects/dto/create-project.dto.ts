import {
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MetricsDto } from './metrics.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsIn(['pendente', 'emandamento', 'concluido'])
  status: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @ApiProperty()
  progress: number;

  @IsNotEmpty()
  @ApiProperty()
  hero: string;

  @ValidateNested()
  @ApiProperty()
  @Type(() => MetricsDto)
  metrics: MetricsDto;
}
