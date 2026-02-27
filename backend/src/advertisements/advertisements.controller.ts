import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdvertisementsService } from './advertisements.service';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@ApiTags('advertisements')
@Controller()
export class AdvertisementsController {
  constructor(private readonly adsService: AdvertisementsService) {}

  @Get('ads/active')
  @ApiOperation({ summary: 'Publicité active (public)' })
  getActive() {
    return this.adsService.findActive();
  }

  @Get('admin/ads')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Liste toutes les publicités' })
  findAll() {
    return this.adsService.findAll();
  }

  @Post('admin/ads')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Créer une publicité' })
  create(@Body() dto: CreateAdvertisementDto) {
    return this.adsService.create(dto);
  }

  @Patch('admin/ads/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Modifier une publicité' })
  update(@Param('id') id: string, @Body() dto: UpdateAdvertisementDto) {
    return this.adsService.update(id, dto);
  }

  @Delete('admin/ads/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Admin] Supprimer une publicité' })
  remove(@Param('id') id: string) {
    return this.adsService.delete(id);
  }
}
