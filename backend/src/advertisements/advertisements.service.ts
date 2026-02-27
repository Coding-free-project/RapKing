import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';

@Injectable()
export class AdvertisementsService {
  constructor(private prisma: PrismaService) {}

  async findActive() {
    const now = new Date();
    return this.prisma.advertisement.findMany({
      where: {
        isActive: true,
        OR: [
          { startDate: null },
          { startDate: { lte: now } },
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.advertisement.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findById(id: string) {
    const ad = await this.prisma.advertisement.findUnique({ where: { id } });
    if (!ad) throw new NotFoundException('Publicité non trouvée');
    return ad;
  }

  async create(dto: CreateAdvertisementDto) {
    return this.prisma.advertisement.create({
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });
  }

  async update(id: string, dto: UpdateAdvertisementDto) {
    await this.findById(id);
    const data: any = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    return this.prisma.advertisement.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prisma.advertisement.delete({ where: { id } });
  }
}
