import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import { fr, enUS } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, lang = 'fr'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'dd MMMM yyyy', { locale: lang === 'fr' ? fr : enUS })
}

export function formatRelativeDate(date: string | Date, lang = 'fr'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(d, { addSuffix: true, locale: lang === 'fr' ? fr : enUS })
}

export function extractYoutubeThumb(youtubeId: string, quality: 'default' | 'hq' | 'maxres' = 'hq'): string {
  const qualityMap = { default: 'default', hq: 'hqdefault', maxres: 'maxresdefault' }
  return `https://img.youtube.com/vi/${youtubeId}/${qualityMap[quality]}.jpg`
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trim() + '…'
}
