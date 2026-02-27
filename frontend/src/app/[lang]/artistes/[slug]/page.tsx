import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getArtistBySlug } from '@/lib/api'
import ArticleCard from '@/components/articles/ArticleCard'
import ClipCard from '@/components/clips/ClipCard'

export const revalidate = 60

interface ArtistPageProps {
  params: { lang: string; slug: string }
}

export async function generateMetadata({ params: { lang, slug } }: ArtistPageProps): Promise<Metadata> {
  try {
    const res = await getArtistBySlug(slug)
    const artist = res.data
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rapking.com'
    return {
      title: `${artist.name} — RapKing`,
      description: artist.bio ? artist.bio.slice(0, 160) : `Découvrez ${artist.name} sur RapKing`,
      openGraph: {
        title: `${artist.name} — RapKing`,
        images: artist.photo ? [artist.photo] : [],
        type: 'profile',
      },
      alternates: { canonical: `${siteUrl}/${lang}/artistes/${slug}` },
    }
  } catch {
    return { title: 'Artiste — RapKing' }
  }
}

export default async function ArtistPage({ params: { lang, slug } }: ArtistPageProps) {
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang, namespace: 'artists' })

  let artist
  try {
    const res = await getArtistBySlug(slug)
    artist = res.data
  } catch {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rapking.com'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: artist.name,
    image: artist.photo,
    description: artist.bio,
    url: `${siteUrl}/${lang}/artistes/${slug}`,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10">
        {/* Back */}
        <Link href={`/${lang}/artistes`} className="text-xs uppercase tracking-widest text-[#555555] hover:text-black transition-colors mb-8 inline-block">
          ← {t('title')}
        </Link>

        {/* Artist header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12 pb-10 border-b border-[#CCCCCC]">
          {artist.photo && (
            <div className="relative w-32 h-32 md:w-48 md:h-48 flex-shrink-0 overflow-hidden bg-[#F5F5F5]">
              <Image src={artist.photo} alt={artist.name} fill className="object-cover" sizes="192px" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="font-bebas text-5xl md:text-7xl leading-none text-black">{artist.name}</h1>
            {artist.country && (
              <p className="text-xs uppercase tracking-widest text-[#555555] mt-1">{artist.country}</p>
            )}
            {artist.bio && (
              <p className="text-[#1A1A1A] mt-4 leading-relaxed max-w-2xl">{artist.bio}</p>
            )}
          </div>
        </div>

        {/* Articles */}
        {artist.articles.length > 0 && (
          <section className="mb-12">
            <h2 className="font-bebas text-3xl mb-6 pb-3 border-b border-[#CCCCCC]">{t('articles')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artist.articles.map((article) => (
                <ArticleCard key={article.id} article={article} lang={lang} />
              ))}
            </div>
          </section>
        )}

        {/* Clips */}
        {artist.clips.length > 0 && (
          <section>
            <h2 className="font-bebas text-3xl mb-6 pb-3 border-b border-[#CCCCCC]">{t('clips')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artist.clips.map((clip) => (
                <ClipCard key={clip.id} clip={clip} lang={lang} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
