import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getClipBySlug } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import ShareButton from '@/components/ui/ShareButton'

export const revalidate = 60

interface ClipPageProps {
  params: { lang: string; slug: string }
}

export async function generateMetadata({ params: { lang, slug } }: ClipPageProps): Promise<Metadata> {
  try {
    const res = await getClipBySlug(slug)
    const clip = res.data
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rapking.com'
    return {
      title: `${clip.title} — ${clip.artist.name} — RapKing`,
      openGraph: {
        title: `${clip.title} — ${clip.artist.name}`,
        type: 'video.other',
        url: `${siteUrl}/${lang}/clips/${slug}`,
        images: [`https://img.youtube.com/vi/${clip.youtubeId}/maxresdefault.jpg`],
      },
    }
  } catch {
    return { title: 'Clip — RapKing' }
  }
}

export default async function ClipPage({ params: { lang, slug } }: ClipPageProps) {
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang })

  let clip
  try {
    const res = await getClipBySlug(slug)
    clip = res.data
  } catch {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rapking.com'
  const clipUrl = `${siteUrl}/${lang}/clips/${slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: clip.title,
    description: `${clip.title} par ${clip.artist.name}`,
    thumbnailUrl: `https://img.youtube.com/vi/${clip.youtubeId}/maxresdefault.jpg`,
    uploadDate: clip.publishedAt,
    embedUrl: `https://www.youtube.com/embed/${clip.youtubeId}`,
    url: clipUrl,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-[900px] mx-auto px-4 md:px-6 py-10">
        {/* Back */}
        <Link href={`/${lang}/clips`} className="text-xs uppercase tracking-widest text-[#555555] hover:text-black transition-colors mb-6 inline-block">
          ← {t('clips.title')}
        </Link>

        {/* YouTube player */}
        <div className="relative ratio-16-9 mb-6 bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${clip.youtubeId}?rel=0`}
            title={clip.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Info */}
        <h1 className="font-bebas text-4xl md:text-5xl leading-none text-black mb-2">{clip.title}</h1>
        <div className="flex items-center gap-4 mt-3">
          <Link
            href={`/${lang}/artistes/${clip.artist.slug}`}
            className="text-xs uppercase tracking-widest text-[#555555] hover:text-black transition-colors font-semibold"
          >
            {clip.artist.name}
          </Link>
          <span className="text-[#CCCCCC]">·</span>
          <span className="text-xs text-[#555555]">{formatDate(clip.publishedAt, lang)}</span>
          <span className="text-[#CCCCCC]">·</span>
          <a
            href={clip.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-widest text-[#555555] hover:text-black transition-colors"
          >
            {t('clips.watchOn')} ↗
          </a>
        </div>

        {/* Share */}
        <div className="mt-8 pt-6 border-t border-[#CCCCCC]">
          <ShareButton url={clipUrl} title={clip.title} lang={lang} />
        </div>
      </div>
    </>
  )
}
