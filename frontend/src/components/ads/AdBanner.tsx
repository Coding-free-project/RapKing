'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getActiveAd } from '@/lib/api'
import type { Advertisement } from '@/types'

export default function AdBanner() {
  const [ads, setAds] = useState<Advertisement[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    getActiveAd()
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const visible = res.data.filter(
            (ad: Advertisement) =>
              (ad.type === 'image' && ad.imageUrl) ||
              (ad.type === 'script' && ad.scriptCode)
          )
          setAds(visible)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (ads.length <= 1) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % ads.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [ads.length])

  if (ads.length === 0) return null

  const ad = ads[index]

  return (
    <div className="w-full bg-[#F5F5F5] flex justify-center items-center" style={{ maxHeight: 90 }}>
      {ad.type === 'image' && ad.imageUrl && (
        <a
          href={ad.linkUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
          style={{ maxHeight: 90 }}
        >
          <Image
            src={ad.imageUrl}
            alt={ad.name}
            width={1200}
            height={90}
            className="w-full object-cover"
            style={{ maxHeight: 90 }}
          />
        </a>
      )}
      {ad.type === 'script' && ad.scriptCode && (
        <div
          className="w-full overflow-hidden"
          style={{ maxHeight: 90 }}
          dangerouslySetInnerHTML={{ __html: ad.scriptCode }}
        />
      )}
    </div>
  )
}
