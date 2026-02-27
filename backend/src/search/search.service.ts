import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: string) {
    if (!query || query.trim().length < 2) {
      return { articles: [], artists: [], clips: [] };
    }

    const q = query.trim();

    const [articles, artists, clips] = await Promise.all([
      this.prisma.article.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { content: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          coverImage: true,
          category: true,
          publishedAt: true,
        },
        orderBy: { publishedAt: 'desc' },
      }),
      this.prisma.artist.findMany({
        where: {
          name: { contains: q, mode: 'insensitive' },
        },
        take: 5,
        select: {
          id: true,
          name: true,
          slug: true,
          photo: true,
          country: true,
        },
      }),
      this.prisma.clip.findMany({
        where: {
          title: { contains: q, mode: 'insensitive' },
        },
        take: 5,
        include: { artist: { select: { id: true, name: true, slug: true } } },
        orderBy: { publishedAt: 'desc' },
      }),
    ]);

    return { articles, artists, clips };
  }
}
