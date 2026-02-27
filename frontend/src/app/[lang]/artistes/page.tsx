'use client'

import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { getArtists } from '@/lib/api'
import ArtistCard from '@/components/artists/ArtistCard'

interface ArtistesPageProps {
  params: { lang: string }
}

export default function ArtistesPage({ params: { lang } }: ArtistesPageProps) {
  const t = useTranslations('artists')

  const { data, isLoading } = useQuery({
    queryKey: ['artists'],
    queryFn: () => getArtists({ limit: 50 }),
  })

  const artists = data?.data.data ?? []

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10">
      <h1 className="font-bebas text-5xl md:text-6xl mb-8 pb-4 border-b border-[#CCCCCC]">
        {t('title')}
      </h1>

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="ratio-1-1 bg-[#F5F5F5] mb-3" />
              <div className="h-5 bg-[#F5F5F5] w-3/4 mx-auto" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && artists.length === 0 && (
        <p className="text-[#555555] text-center py-20">{t('noArtists')}</p>
      )}

      {!isLoading && artists.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} lang={lang} />
          ))}
        </div>
      )}
    </div>
  )
}
