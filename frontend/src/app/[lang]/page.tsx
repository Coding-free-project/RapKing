import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getArticles, getClips } from '@/lib/api'
import ArticleCard from '@/components/articles/ArticleCard'
import ClipCard from '@/components/clips/ClipCard'

export const revalidate = 60

interface HomeProps {
  params: { lang: string }
}

export async function generateMetadata({ params: { lang } }: HomeProps): Promise<Metadata> {
  const t = await getTranslations({ locale: lang, namespace: 'seo' })
  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
    openGraph: {
      title: t('homeTitle'),
      description: t('homeDescription'),
      url: `/${lang}`,
      type: 'website',
    },
  }
}

export default async function HomePage({ params: { lang } }: HomeProps) {
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang, namespace: 'home' })

  const [articlesRes, clipsRes] = await Promise.allSettled([
    getArticles({ page: 1, limit: 6 }),
    getClips({ page: 1, limit: 6 }),
  ])

  const articles = articlesRes.status === 'fulfilled' ? articlesRes.value.data.data : []
  const clips = clipsRes.status === 'fulfilled' ? clipsRes.value.data.data : []

  const [featuredArticle, ...restArticles] = articles

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10">
      {/* Hero */}
      <section className="mb-14">
        <h1 className="font-bebas text-6xl md:text-8xl lg:text-[120px] leading-none text-black mb-3">
          {t('heroTitle')}
        </h1>
        <p className="text-[#555555] text-base md:text-lg max-w-xl">
          {t('heroSubtitle')}
        </p>
      </section>

      {/* Latest articles */}
      <section className="mb-14">
        <div className="flex items-baseline justify-between mb-6 border-b border-[#CCCCCC] pb-3">
          <h2 className="font-bebas text-3xl tracking-tight">{t('latestArticles')}</h2>
          <Link href={`/${lang}/articles`} className="text-xs uppercase tracking-widest text-[#555555] hover:text-black transition-colors">
            {t('seeAll')} →
          </Link>
        </div>

        {featuredArticle && (
          <div className="mb-8">
            <ArticleCard article={featuredArticle} lang={lang} variant="featured" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {restArticles.slice(0, 5).map((article) => (
            <ArticleCard key={article.id} article={article} lang={lang} />
          ))}
        </div>
      </section>

      {/* Latest clips */}
      <section>
        <div className="flex items-baseline justify-between mb-6 border-b border-[#CCCCCC] pb-3">
          <h2 className="font-bebas text-3xl tracking-tight">{t('latestClips')}</h2>
          <Link href={`/${lang}/clips`} className="text-xs uppercase tracking-widest text-[#555555] hover:text-black transition-colors">
            {t('seeAll')} →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {clips.map((clip) => (
            <ClipCard key={clip.id} clip={clip} lang={lang} />
          ))}
        </div>
      </section>
    </div>
  )
}
