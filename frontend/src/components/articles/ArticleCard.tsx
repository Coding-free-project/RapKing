import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Badge from '@/components/ui/Badge'
import { formatDate, truncate } from '@/lib/utils'
import type { Article } from '@/types'

interface ArticleCardProps {
  article: Article
  lang: string
  variant?: 'default' | 'featured' | 'compact'
}

export default function ArticleCard({ article, lang, variant = 'default' }: ArticleCardProps) {
  const t = useTranslations('articles')

  if (variant === 'featured') {
    return (
      <Link href={`/${lang}/articles/${article.slug}`} className="group block">
        <div className="relative ratio-16-9 overflow-hidden bg-[#F5F5F5] rounded-xl">
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full bg-[#F5F5F5]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <Badge className="mb-3">{article.category === 'news' ? t('news') : t('interviews')}</Badge>
            <h2 className="font-bebas text-3xl md:text-4xl text-white leading-none">
              {article.title}
            </h2>
            {article.publishedAt && (
              <p className="text-white/60 text-xs mt-2">{formatDate(article.publishedAt, lang)}</p>
            )}
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={`/${lang}/articles/${article.slug}`} className="group flex gap-3">
        <div className="relative w-20 h-14 flex-shrink-0 bg-[#F5F5F5] overflow-hidden">
          {article.coverImage && (
            <Image src={article.coverImage} alt={article.title} fill className="object-cover" sizes="80px" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <Badge variant="outline" className="mb-1">{article.category === 'news' ? t('news') : t('interviews')}</Badge>
          <h3 className="text-sm font-semibold text-[#1A1A1A] leading-tight group-hover:underline line-clamp-2">
            {article.title}
          </h3>
          {article.publishedAt && (
            <p className="text-[#555555] text-xs mt-1">{formatDate(article.publishedAt, lang)}</p>
          )}
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/${lang}/articles/${article.slug}`} className="group block">
      <div className="relative ratio-16-9 overflow-hidden bg-[#F5F5F5] mb-4 rounded-xl">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-[#F5F5F5]" />
        )}
      </div>
      <Badge className="mb-2">{article.category === 'news' ? t('news') : t('interviews')}</Badge>
      <h3 className="font-bebas text-xl text-[#1A1A1A] leading-tight group-hover:opacity-70 transition-opacity">
        {article.title}
      </h3>
      {article.artist && (
        <p className="text-xs text-[#555555] uppercase tracking-wide mt-1">{article.artist.name}</p>
      )}
      {article.publishedAt && (
        <p className="text-[#555555] text-xs mt-1">{formatDate(article.publishedAt, lang)}</p>
      )}
    </Link>
  )
}
