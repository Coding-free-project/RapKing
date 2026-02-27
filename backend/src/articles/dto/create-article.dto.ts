import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ArticleCategory {
  news = 'news',
  interview = 'interview',
}

export enum ArticleLang {
  fr = 'fr',
  en = 'en',
}

export class CreateArticleDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ enum: ArticleCategory, default: 'news' })
  @IsOptional()
  @IsEnum(ArticleCategory)
  category?: ArticleCategory;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @ApiPropertyOptional({ enum: ArticleLang, default: 'fr' })
  @IsOptional()
  @IsEnum(ArticleLang)
  lang?: ArticleLang;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(160)
  metaDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  artistId?: string;
}
