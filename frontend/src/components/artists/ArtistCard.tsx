import Link from 'next/link'
import Image from 'next/image'
import type { Artist } from '@/types'

interface ArtistCardProps {
  artist: Artist & { _count?: { articles: number; clips: number } }
  lang: string
}

export default function ArtistCard({ artist, lang }: ArtistCardProps) {
  return (
    <Link href={`/${lang}/artistes/${artist.slug}`} className="group block text-center">
      <div className="relative w-full ratio-1-1 bg-[#F5F5F5] overflow-hidden mb-3">
        {artist.photo ? (
          <Image
            src={artist.photo}
            alt={artist.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#F5F5F5]">
            <span className="font-bebas text-5xl text-[#CCCCCC]">
              {artist.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <h3 className="font-bebas text-xl tracking-wide text-[#1A1A1A] group-hover:opacity-70 transition-opacity">
        {artist.name}
      </h3>
      {artist.country && (
        <p className="text-xs text-[#555555] uppercase tracking-widest">{artist.country}</p>
      )}
      {artist._count && (
        <p className="text-xs text-[#555555] mt-1">
          {artist._count.articles} articles · {artist._count.clips} clips
        </p>
      )}
    </Link>
  )
}
