import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ClipsService } from './clips.service';
import { CreateClipDto } from './dto/create-clip.dto';
import { UpdateClipDto } from './dto/update-clip.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@ApiTags('clips')
@Controller()
export class ClipsController {
  constructor(private readonly clipsService: ClipsService) {}

  @Get('clips')
  @ApiOperation({ summary: 'Liste des clips' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'artistId', required: false })
  @ApiQuery({ name: 'sort', required: false, enum: ['asc', 'desc'] })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('artistId') artistId?: string,
    @Query('sort') sort?: string,
  ) {
    return this.clipsService.findAll({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 12,
      artistId,
      sort,
    });
  }

  @Get('clips/:slug')
  @ApiOperation({ summary: 'Détail clip par slug' })
  findOne(@Param('slug') slug: string) {
    return this.clipsService.findBySlug(slug);
  }

  @Get('admin/clips')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Liste tous les clips' })
  findAllAdmin(@Query('limit') limit?: string) {
    return this.clipsService.findAll({
      page: 1,
      limit: limit ? parseInt(limit) : 50,
    });
  }

  @Post('admin/clips')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Ajouter un clip' })
  create(@Body() dto: CreateClipDto) {
    return this.clipsService.create(dto);
  }

  @Patch('admin/clips/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Modifier un clip' })
  update(@Param('id') id: string, @Body() dto: UpdateClipDto) {
    return this.clipsService.update(id, dto);
  }

  @Delete('admin/clips/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Admin] Supprimer un clip' })
  remove(@Param('id') id: string) {
    return this.clipsService.delete(id);
  }
}
