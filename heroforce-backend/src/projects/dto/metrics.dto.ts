import { IsNumber } from 'class-validator';

export class MetricsDto {
  @IsNumber()
  agility: number;

  @IsNumber()
  enchantment: number;

  @IsNumber()
  efficiency: number;

  @IsNumber()
  excellence: number;

  @IsNumber()
  transparency: number;

  @IsNumber()
  ambition: number;
}
