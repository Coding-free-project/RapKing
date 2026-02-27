import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@ApiTags('artists')
@Controller()
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get('artists')
  @ApiOperation({ summary: 'Liste des artistes' })
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.artistsService.findAll({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get('artists/:slug')
  @ApiOperation({ summary: 'Fiche artiste par slug' })
  findOne(@Param('slug') slug: string) {
    return this.artistsService.findBySlug(slug);
  }

  @Get('admin/artists')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Liste tous les artistes' })
  findAllAdmin(@Query('limit') limit?: string) {
    return this.artistsService.findAll({
      page: 1,
      limit: limit ? parseInt(limit) : 100,
    });
  }

  @Get('admin/artists/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Détail artiste par id' })
  findOneAdmin(@Param('id') id: string) {
    return this.artistsService.findById(id);
  }

  @Post('admin/artists')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Créer un artiste' })
  create(@Body() dto: CreateArtistDto) {
    return this.artistsService.create(dto);
  }

  @Patch('admin/artists/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Modifier un artiste' })
  update(@Param('id') id: string, @Body() dto: UpdateArtistDto) {
    return this.artistsService.update(id, dto);
  }

  @Delete('admin/artists/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Admin] Supprimer un artiste' })
  remove(@Param('id') id: string) {
    return this.artistsService.delete(id);
  }
}
