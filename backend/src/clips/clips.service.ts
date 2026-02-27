import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClipDto } from './dto/create-clip.dto';
import { UpdateClipDto } from './dto/update-clip.dto';
import slugify from 'slugify';

@Injectable()
export class ClipsService {
  constructor(private prisma: PrismaService) {}

  extractYoutubeId(url: string): string {
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
      /(?:youtu\.be\/)([^&\n?#]+)/,
      /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
      /(?:youtube\.com\/shorts\/)([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    throw new BadRequestException('URL YouTube invalide');
  }

  private generateSlug(title: string): string {
    return slugify(title, { lower: true, strict: true, locale: 'fr' });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    artistId?: string;
    sort?: string;
  }) {
    const { page = 1, limit = 12, artistId, sort } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (artistId) where.artistId = artistId;

    const orderBy =
      sort === 'asc' ? { publishedAt: 'asc' as const } : { publishedAt: 'desc' as const };

    const [clips, total] = await Promise.all([
      this.prisma.clip.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { artist: { select: { id: true, name: true, slug: true } } },
      }),
      this.prisma.clip.count({ where }),
    ]);

    return {
      data: clips,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlug(slug: string) {
    const clip = await this.prisma.clip.findUnique({
      where: { slug },
      include: { artist: true },
    });
    if (!clip) throw new NotFoundException('Clip non trouvé');
    return clip;
  }

  async findById(id: string) {
    const clip = await this.prisma.clip.findUnique({ where: { id } });
    if (!clip) throw new NotFoundException('Clip non trouvé');
    return clip;
  }

  async create(dto: CreateClipDto) {
    const youtubeId = this.extractYoutubeId(dto.youtubeUrl);
    const baseSlug = this.generateSlug(dto.title);
    let slug = baseSlug;
    let counter = 1;

    while (await this.prisma.clip.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    return this.prisma.clip.create({
      data: {
        title: dto.title,
        slug,
        youtubeUrl: dto.youtubeUrl,
        youtubeId,
        artistId: dto.artistId,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : new Date(),
      },
      include: { artist: { select: { id: true, name: true, slug: true } } },
    });
  }

  async update(id: string, dto: UpdateClipDto) {
    await this.findById(id);

    const data: any = { ...dto };
    if (dto.youtubeUrl) {
      data.youtubeId = this.extractYoutubeId(dto.youtubeUrl);
    }

    return this.prisma.clip.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prisma.clip.delete({ where: { id } });
  }
}
