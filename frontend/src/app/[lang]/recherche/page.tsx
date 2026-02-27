import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { search } from '@/lib/api'
import Badge from '@/components/ui/Badge'
import { extractYoutubeThumb, formatDate } from '@/lib/utils'

interface RecherchePageProps {
  params: { lang: string }
  searchParams: { q?: string }
}

export async function generateMetadata({ params: { lang } }: RecherchePageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: lang, namespace: 'seo' })
  return { title: t('searchTitle') }
}

export default async function RecherchePage({ params: { lang }, searchParams }: RecherchePageProps) {
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang })
  const query = searchParams.q?.trim() || ''

  let results = { articles: [], artists: [], clips: [] }
  if (query.length >= 2) {
    try {
      const res = await search(query)
      if (res.success) results = res.data as any
    } catch {}
  }

  const hasResults = results.articles.length > 0 || results.artists.length > 0 || results.clips.length > 0

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10">
      <h1 className="font-bebas text-5xl md:text-6xl mb-2">{t('search.title')}</h1>

      {query && (
        <p className="text-[#555555] mb-8">
          {hasResults ? t('search.results') : t('search.noResults')} «{query}»
        </p>
      )}

      {query && !hasResults && (
        <div className="text-center py-20">
          <p className="text-[#555555] text-lg">{t('search.noResults')} «{query}»</p>
        </div>
      )}

      {/* Articles */}
      {results.articles.length > 0 && (
        <section className="mb-12">
          <h2 className="font-bebas text-3xl mb-5 pb-3 border-b border-[#CCCCCC]">{t('search.articles')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(results.articles as any[]).map((article) => (
              <Link key={article.id} href={`/${lang}/articles/${article.slug}`} className="group flex gap-4">
                {article.coverImage && (
                  <div className="relative w-24 h-16 flex-shrink-0 overflow-hidden bg-[#F5F5F5]">
                    <Image src={article.coverImage} alt={article.title} fill className="object-cover" sizes="96px" />
                  </div>
                )}
                <div>
                  <Badge className="mb-1">{article.category}</Badge>
                  <h3 className="text-sm font-semibold text-[#1A1A1A] group-hover:underline line-clamp-2">{article.title}</h3>
                  {article.publishedAt && (
                    <p className="text-xs text-[#555555] mt-1">{formatDate(article.publishedAt, lang)}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Artists */}
      {results.artists.length > 0 && (
        <section className="mb-12">
          <h2 className="font-bebas text-3xl mb-5 pb-3 border-b border-[#CCCCCC]">{t('search.artists')}</h2>
          <div className="flex flex-wrap gap-4">
            {(results.artists as any[]).map((artist) => (
              <Link key={artist.id} href={`/${lang}/artistes/${artist.slug}`} className="group flex items-center gap-3 border border-[#CCCCCC] p-3 hover:border-black transition-colors">
                {artist.photo && (
                  <Image src={artist.photo} alt={artist.name} width={40} height={40} className="object-cover rounded-full" />
                )}
                <div>
                  <p className="font-semibold text-sm text-[#1A1A1A] group-hover:underline">{artist.name}</p>
                  {artist.country && <p className="text-xs text-[#555555]">{artist.country}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Clips */}
      {results.clips.length > 0 && (
        <section>
          <h2 className="font-bebas text-3xl mb-5 pb-3 border-b border-[#CCCCCC]">{t('search.clips')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(results.clips as any[]).map((clip) => (
              <Link key={clip.id} href={`/${lang}/clips/${clip.slug}`} className="group flex gap-3">
                <div className="relative w-28 h-16 flex-shrink-0 overflow-hidden bg-[#F5F5F5]">
                  <Image src={extractYoutubeThumb(clip.youtubeId)} alt={clip.title} fill className="object-cover" sizes="112px" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A1A] group-hover:underline line-clamp-2">{clip.title}</h3>
                  <p className="text-xs text-[#555555] mt-1">{clip.artist.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
