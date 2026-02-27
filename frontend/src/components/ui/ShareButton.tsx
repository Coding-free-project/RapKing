'use client'

import { Share2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

interface ShareButtonProps {
  url: string
  title: string
  lang: string
}

export default function ShareButton({ url, title }: ShareButtonProps) {
  const t = useTranslations('common')
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 text-sm text-[#555555] hover:text-black transition-colors uppercase tracking-wide"
    >
      <Share2 size={16} />
      {copied ? t('copied') : t('share')}
    </button>
  )
}
