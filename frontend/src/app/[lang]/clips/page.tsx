'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { getClips, getArtists } from '@/lib/api'
import ClipCard from '@/components/clips/ClipCard'
import Pagination from '@/components/ui/Pagination'

interface ClipsPageProps {
  params: { lang: string }
}

export default function ClipsPage({ params: { lang } }: ClipsPageProps) {
  const t = useTranslations('clips')
  const [page, setPage] = useState(1)
  const [artistId, setArtistId] = useState('')
  const [sort, setSort] = useState<'desc' | 'asc'>('desc')

  const { data, isLoading } = useQuery({
    queryKey: ['clips', page, artistId, sort],
    queryFn: () => getClips({ page, limit: 12, artistId: artistId || undefined, sort }),
  })

  const { data: artistsRes } = useQuery({
    queryKey: ['artists-list'],
    queryFn: () => getArtists({ limit: 100 }),
  })

  const clips = data?.data.data ?? []
  const meta = data?.data.meta
  const artists = artistsRes?.data.data ?? []

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-[#CCCCCC] gap-4">
        <h1 className="font-bebas text-5xl md:text-6xl">{t('title')}</h1>

        <div className="flex flex-wrap gap-3">
          {/* Artist filter */}
          <select
            value={artistId}
            onChange={(e) => { setArtistId(e.target.value); setPage(1) }}
            className="text-sm border border-[#CCCCCC] px-3 py-1.5 bg-white text-[#1A1A1A] focus:border-black outline-none"
          >
            <option value="">{t('allArtists')}</option>
            {artists.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>

          {/* Sort filter */}
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value as 'asc' | 'desc'); setPage(1) }}
            className="text-sm border border-[#CCCCCC] px-3 py-1.5 bg-white text-[#1A1A1A] focus:border-black outline-none"
          >
            <option value="desc">{t('newest')}</option>
            <option value="asc">{t('oldest')}</option>
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="ratio-16-9 bg-[#F5F5F5] mb-3" />
              <div className="h-5 bg-[#F5F5F5] w-3/4 mb-1" />
              <div className="h-3 bg-[#F5F5F5] w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && clips.length === 0 && (
        <p className="text-[#555555] text-center py-20">{t('noClips')}</p>
      )}

      {!isLoading && clips.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {clips.map((clip) => (
            <ClipCard key={clip.id} clip={clip} lang={lang} />
          ))}
        </div>
      )}

      {meta && (
        <Pagination currentPage={page} totalPages={meta.totalPages} onPageChange={setPage} />
      )}
    </div>
  )
}
