import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@ApiTags('articles')
@Controller()
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // ─── Routes publiques ───────────────────────────────────────

  @Get('articles')
  @ApiOperation({ summary: 'Liste paginée des articles publiés' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, enum: ['news', 'interview'] })
  @ApiQuery({ name: 'lang', required: false, enum: ['fr', 'en'] })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
    @Query('lang') lang?: string,
  ) {
    return this.articlesService.findAll({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      category,
      lang,
      published: true,
    });
  }

  @Get('articles/:slug')
  @ApiOperation({ summary: 'Détail article par slug' })
  findOne(@Param('slug') slug: string) {
    return this.articlesService.findBySlug(slug);
  }

  // ─── Routes admin ────────────────────────────────────────────

  @Get('admin/articles')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Liste tous les articles' })
  findAllAdmin(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
  ) {
    return this.articlesService.findAll({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      category,
    });
  }

  @Get('admin/articles/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Détail article par id' })
  findOneAdmin(@Param('id') id: string) {
    return this.articlesService.findById(id);
  }

  @Post('admin/articles')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Créer un article' })
  create(@Body() dto: CreateArticleDto) {
    return this.articlesService.create(dto);
  }

  @Patch('admin/articles/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Modifier un article' })
  update(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return this.articlesService.update(id, dto);
  }

  @Delete('admin/articles/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Admin] Supprimer un article' })
  remove(@Param('id') id: string) {
    return this.articlesService.delete(id);
  }
}
