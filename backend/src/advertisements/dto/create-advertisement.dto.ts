import { IsString, IsOptional, IsBoolean, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAdvertisementDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ enum: ['image', 'script'], default: 'image' })
  @IsOptional()
  @IsEnum(['image', 'script'])
  type?: 'image' | 'script';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  linkUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  scriptCode?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
