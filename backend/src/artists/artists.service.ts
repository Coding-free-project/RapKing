import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import slugify from 'slugify';

@Injectable()
export class ArtistsService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return slugify(name, { lower: true, strict: true });
  }

  async findAll(params: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const [artists, total] = await Promise.all([
      this.prisma.artist.findMany({
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { articles: true, clips: true } },
        },
      }),
      this.prisma.artist.count(),
    ]);

    return {
      data: artists,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlug(slug: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { slug },
      include: {
        articles: {
          where: { published: true },
          orderBy: { publishedAt: 'desc' },
          take: 10,
        },
        clips: {
          orderBy: { publishedAt: 'desc' },
          take: 10,
        },
      },
    });
    if (!artist) throw new NotFoundException('Artiste non trouvé');
    return artist;
  }

  async findById(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) throw new NotFoundException('Artiste non trouvé');
    return artist;
  }

  async create(dto: CreateArtistDto) {
    const baseSlug = this.generateSlug(dto.name);
    let slug = baseSlug;
    let counter = 1;

    while (await this.prisma.artist.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    return this.prisma.artist.create({ data: { ...dto, slug } });
  }

  async update(id: string, dto: UpdateArtistDto) {
    await this.findById(id);
    return this.prisma.artist.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prisma.artist.delete({ where: { id } });
  }
}
