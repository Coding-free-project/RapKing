import Link from 'next/link'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { extractYoutubeThumb, formatDate } from '@/lib/utils'
import type { Clip } from '@/types'

interface ClipCardProps {
  clip: Clip
  lang: string
}

export default function ClipCard({ clip, lang }: ClipCardProps) {
  return (
    
    <Link href={`/${lang}/clips/${clip.slug}`} className="group block">
      <div className="relative ratio-16-9 overflow-hidden bg-[#F5F5F5] mb-3">
        <Image
          src={extractYoutubeThumb(clip.youtubeId, 'hq')}
          alt={clip.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play size={20} className="text-black ml-1" />
          </div>
        </div>
      </div>
      <h3 className="font-bebas text-lg text-[#1A1A1A] leading-tight group-hover:opacity-70 transition-opacity">
        {clip.title}
      </h3>
      <p className="text-xs text-[#555555] uppercase tracking-wide mt-1">{clip.artist.name}</p>
      <p className="text-xs text-[#555555] mt-0.5">{formatDate(clip.publishedAt, lang)}</p>
    </Link>
  )
}
