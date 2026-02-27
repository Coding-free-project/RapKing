'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Search, X } from 'lucide-react'
import { search } from '@/lib/api'
import type { SearchResults } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { extractYoutubeThumb } from '@/lib/utils'

interface SearchBarProps {
  lang: string
  onClose?: () => void
}

export default function SearchBar({ lang, onClose }: SearchBarProps) {
  const t = useTranslations('search')
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    clearTimeout(debounceRef.current)

    if (query.length < 2) {
      setResults(null)
      return
    }

    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await search(query)
        if (res.success) setResults(res.data)
      } catch {}
      finally { setLoading(false) }
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/${lang}/recherche?q=${encodeURIComponent(query)}`)
      onClose?.()
    }
  }

  const hasResults = results && (
    results.articles.length > 0 || results.artists.length > 0 || results.clips.length > 0
  )

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex-1 flex items-center border border-[#CCCCCC] focus-within:border-black transition-colors">
          <Search size={16} className="ml-3 text-[#555555] flex-shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('placeholder')}
            className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="mr-2 text-[#555555] hover:text-black">
              <X size={14} />
            </button>
          )}
        </div>
        <button type="submit" className="px-4 py-2.5 bg-black text-white text-sm uppercase tracking-wide hover:bg-[#1A1A1A] transition-colors">
          {t('title')}
        </button>
      </form>

      {/* Dropdown results */}
      {query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#CCCCCC] shadow-lg z-50 max-h-[60vh] overflow-y-auto">
          {loading && (
            <p className="px-4 py-3 text-sm text-[#555555]">{t('searching')}</p>
          )}
          {!loading && !hasResults && results && (
            <p className="px-4 py-3 text-sm text-[#555555]">{t('noResults')} «{query}»</p>
          )}
          {!loading && hasResults && (
            <div>
              {results!.articles.length > 0 && (
                <div className="border-b border-[#F5F5F5]">
                  <p className="px-4 py-2 text-[10px] uppercase tracking-widest text-[#555555] font-semibold bg-[#F5F5F5]">
                    {t('articles')}
                  </p>
                  {results!.articles.map((a) => (
                    <Link
                      key={a.id}
                      href={`/${lang}/articles/${a.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F5F5] transition-colors"
                    >
                      {a.coverImage && (
                        <Image src={a.coverImage} alt={a.title} width={40} height={28} className="object-cover flex-shrink-0" />
                      )}
                      <span className="text-sm text-[#1A1A1A] line-clamp-1">{a.title}</span>
                    </Link>
                  ))}
                </div>
              )}
              {results!.artists.length > 0 && (
                <div className="border-b border-[#F5F5F5]">
                  <p className="px-4 py-2 text-[10px] uppercase tracking-widest text-[#555555] font-semibold bg-[#F5F5F5]">
                    {t('artists')}
                  </p>
                  {results!.artists.map((a) => (
                    <Link
                      key={a.id}
                      href={`/${lang}/artistes/${a.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F5F5] transition-colors"
                    >
                      {a.photo && (
                        <Image src={a.photo} alt={a.name} width={32} height={32} className="object-cover rounded-full flex-shrink-0" />
                      )}
                      <span className="text-sm text-[#1A1A1A]">{a.name}</span>
                      {a.country && <span className="text-xs text-[#555555]">{a.country}</span>}
                    </Link>
                  ))}
                </div>
              )}
              {results!.clips.length > 0 && (
                <div>
                  <p className="px-4 py-2 text-[10px] uppercase tracking-widest text-[#555555] font-semibold bg-[#F5F5F5]">
                    {t('clips')}
                  </p>
                  {results!.clips.map((c) => (
                    <Link
                      key={c.id}
                      href={`/${lang}/clips/${c.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F5F5] transition-colors"
                    >
                      <Image
                        src={extractYoutubeThumb(c.youtubeId)}
                        alt={c.title}
                        width={56}
                        height={32}
                        className="object-cover flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm text-[#1A1A1A] line-clamp-1">{c.title}</p>
                        <p className="text-xs text-[#555555]">{c.artist.name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <Link
                href={`/${lang}/recherche?q=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="block px-4 py-3 text-sm text-center text-[#555555] hover:text-black border-t border-[#F5F5F5] transition-colors"
              >
                {t('results')} «{query}» →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
