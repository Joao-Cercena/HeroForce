import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MetricsDto {
  @IsNumber()
  @ApiProperty()
  agility: number;

  @IsNumber()
  @ApiProperty()
  enchantment: number;

  @IsNumber()
  @ApiProperty()
  efficiency: number;

  @IsNumber()
  @ApiProperty()
  excellence: number;

  @IsNumber()
  @ApiProperty()
  transparency: number;

  @IsNumber()
  @ApiProperty()
  ambition: number;
}
