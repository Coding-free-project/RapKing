import {
  Controller, Get, Post, Patch, Body, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@ApiTags('contact')
@Controller()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('contact')
  @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3 per hour
  @ApiOperation({ summary: 'Envoyer un message de contact' })
  sendMessage(@Body() dto: CreateContactDto) {
    return this.contactService.sendMessage(dto);
  }

  @Get('admin/messages')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Liste des messages contact' })
  findAll() {
    return this.contactService.findAll();
  }

  @Patch('admin/messages/:id/read')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Marquer comme lu' })
  markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }

  @Patch('admin/messages/:id/unread')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Marquer comme non lu' })
  markAsUnread(@Param('id') id: string) {
    return this.contactService.markAsUnread(id);
  }
}
