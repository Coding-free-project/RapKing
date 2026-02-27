import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Instagram, Twitter, Youtube } from 'lucide-react'

interface FooterProps {
  lang: string
}

export default function Footer({ lang }: FooterProps) {
  const t = useTranslations()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href={`/${lang}`} className="font-bebas text-4xl tracking-widest text-white">
              RAPKING
            </Link>
            <p className="mt-2 text-[#555555] text-sm">{t('footer.tagline')}</p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            <Link href={`/${lang}/articles`} className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wide">
              {t('nav.articles')}
            </Link>
            <Link href={`/${lang}/artistes`} className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wide">
              {t('nav.artists')}
            </Link>
            <Link href={`/${lang}/clips`} className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wide">
              {t('nav.clips')}
            </Link>
            <Link href={`/${lang}/contact`} className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wide">
              {t('nav.contact')}
            </Link>
          </nav>

          {/* Social */}
          <div>
            <p className="text-xs uppercase tracking-widest text-[#555555] mb-4">Suivez-nous</p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/rapking"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://twitter.com/rapking"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter / X"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://youtube.com/@rapking"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
              {/* TikTok — pas d'icône lucide, texte */}
              <a
                href="https://tiktok.com/@rapking"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors text-xs font-bold"
                aria-label="TikTok"
              >
                TK
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#1A1A1A] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#555555]">
          <p>© {currentYear} RapKing. {t('footer.rights')}.</p>
          <div className="flex gap-4">
            <Link href={`/fr`} className={lang === 'fr' ? 'text-white' : 'hover:text-white transition-colors'}>
              Français
            </Link>
            <Link href={`/en`} className={lang === 'en' ? 'text-white' : 'hover:text-white transition-colors'}>
              English
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
