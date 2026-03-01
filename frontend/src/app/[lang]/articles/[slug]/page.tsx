import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getArticleBySlug } from '@/lib/api'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import ShareButton from '@/components/ui/ShareButton'

export const revalidate = 60

interface ArticlePageProps {
  params: { lang: string; slug: string }
}

export async function generateMetadata({ params: { lang, slug } }: ArticlePageProps): Promise<Metadata> {
  try {
    const res = await getArticleBySlug(slug)
    const article = res.data
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rapking.com'
    return {
      title: article.metaTitle || `${article.title} — RapKing`,
      description: article.metaDescription || undefined,
      openGraph: {
        title: article.metaTitle || article.title,
        description: article.metaDescription || undefined,
        images: article.coverImage ? [article.coverImage] : [],
        type: 'article',
        url: `${siteUrl}/${lang}/articles/${slug}`,
      },
      alternates: { canonical: `${siteUrl}/${lang}/articles/${slug}` },
    }
  } catch {
    return { title: 'Article — RapKing' }
  }
}

export default async function ArticlePage({ params: { lang, slug } }: ArticlePageProps) {
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang, namespace: 'articles' })

  let article
  try {
    const res = await getArticleBySlug(slug)
    article = res.data
  } catch {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rapking.com'
  const articleUrl = `${siteUrl}/${lang}/articles/${slug}`

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    image: article.coverImage,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    url: articleUrl,
    author: { '@type': 'Organization', name: 'RapKing' },
    publisher: { '@type': 'Organization', name: 'RapKing', url: siteUrl },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="max-w-[800px] mx-auto px-4 md:px-6 py-10">
        {/* Back */}
        <Link href={`/${lang}/articles`} className="text-xs uppercase tracking-widest text-[#555555] hover:text-black transition-colors mb-6 inline-block">
          ← {t('title')}
        </Link>

        {/* Category & meta */}
        <div className="flex items-center gap-3 mb-4">
          <Badge>{article.category === 'news' ? t('news') : t('interviews')}</Badge>
          {article.publishedAt && (
            <span className="text-xs text-[#555555]">{formatDate(article.publishedAt, lang)}</span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-bebas text-4xl md:text-6xl leading-none text-black mb-6">
          {article.title}
        </h1>

        {/* Artist link */}
        {article.artist && (
          <Link
            href={`/${lang}/artistes/${article.artist.slug}`}
            className="text-xs uppercase tracking-widest text-[#555555] hover:text-black transition-colors mb-8 inline-block"
          >
            {article.artist.name}
          </Link>
        )}

        {/* Cover image */}
        {article.coverImage && (
          <div className="relative ratio-16-9 mb-8 overflow-hidden rounded-xl">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="article-content text-[#1A1A1A] leading-relaxed text-base md:text-lg"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Share */}
        <div className="mt-10 pt-6 border-t border-[#CCCCCC]">
          <ShareButton url={articleUrl} title={article.title} lang={lang} />
        </div>
      </article>
    </>
  )
}
