import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import slugify from 'slugify';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(title: string): string {
    return slugify(title, { lower: true, strict: true, locale: 'fr' });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    category?: string;
    lang?: string;
    published?: boolean;
  }) {
    const { page = 1, limit = 10, category, lang, published } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (category) where.category = category;
    if (lang) where.lang = lang;
    if (published !== undefined) where.published = published;

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: { artist: { select: { id: true, name: true, slug: true } } },
      }),
      this.prisma.article.count({ where }),
    ]);

    return {
      data: articles,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: { artist: { select: { id: true, name: true, slug: true } } },
    });
    if (!article) throw new NotFoundException('Article non trouvé');
    return article;
  }

  async findById(id: string) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Article non trouvé');
    return article;
  }

  async create(dto: CreateArticleDto) {
    const baseSlug = this.generateSlug(dto.title);
    let slug = baseSlug;
    let counter = 1;

    while (await this.prisma.article.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const publishedAt =
      dto.published && !dto.publishedAt ? new Date() : dto.publishedAt ? new Date(dto.publishedAt) : null;

    return this.prisma.article.create({
      data: {
        ...dto,
        slug,
        publishedAt,
      },
    });
  }

  async update(id: string, dto: UpdateArticleDto) {
    await this.findById(id);

    const data: any = { ...dto };
    if (dto.title) {
      const newSlug = this.generateSlug(dto.title);
      const existing = await this.prisma.article.findFirst({
        where: { slug: newSlug, NOT: { id } },
      });
      if (!existing) data.slug = newSlug;
    }

    if (dto.published && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    return this.prisma.article.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prisma.article.delete({ where: { id } });
  }
}
