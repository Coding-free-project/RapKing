import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClipDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
  @IsString()
  youtubeUrl: string;

  @ApiProperty()
  @IsString()
  artistId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
