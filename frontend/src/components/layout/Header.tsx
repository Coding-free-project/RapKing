'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Search, Menu, X, Sun, Moon } from 'lucide-react'
import SearchBar from '@/components/search/SearchBar'
import { useTheme } from '@/components/providers/ThemeProvider'

interface HeaderProps {
  lang: string
}

export default function Header({ lang }: HeaderProps) {
  const t = useTranslations('nav')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { theme, toggle } = useTheme()

  const navLinks = [
    { href: `/${lang}`, label: t('home') },
    { href: `/${lang}/articles`, label: t('articles') },
    { href: `/${lang}/artistes`, label: t('artists') },
    { href: `/${lang}/clips`, label: t('clips') },
    { href: `/${lang}/contact`, label: t('contact') },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#CCCCCC]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center h-12">
            <Image src="/logo.png" alt="RapKing" width={140} height={56} className="h-12 w-auto object-contain invert dark:invert-0" priority />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.slice(1, -1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#555555] hover:text-black transition-colors uppercase tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="hidden md:flex items-center gap-1 text-xs text-[#555555]">
              <Link
                href={`/fr${typeof window !== 'undefined' ? window.location.pathname.replace(/^\/(fr|en)/, '') : ''}`}
                className={`px-1 hover:text-black transition-colors ${lang === 'fr' ? 'text-black font-semibold' : ''}`}
              >
                FR
              </Link>
              <span>|</span>
              <Link
                href={`/en${typeof window !== 'undefined' ? window.location.pathname.replace(/^\/(fr|en)/, '') : ''}`}
                className={`px-1 hover:text-black transition-colors ${lang === 'en' ? 'text-black font-semibold' : ''}`}
              >
                EN
              </Link>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="p-2 text-[#555555] hover:text-black transition-colors"
              aria-label="Changer le thème"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#555555] hover:text-black transition-colors"
              aria-label="Rechercher"
            >
              <Search size={20} />
            </button>

            {/* Contact desktop */}
            <Link
              href={`/${lang}/contact`}
              className="hidden md:block text-sm font-medium uppercase tracking-wide border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
            >
              {t('contact')}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-[#555555] hover:text-black"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search bar dropdown */}
        {searchOpen && (
          <div className="py-3 border-t border-[#CCCCCC]">
            <SearchBar lang={lang} onClose={() => setSearchOpen(false)} />
          </div>
        )}

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden py-4 border-t border-[#CCCCCC] flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium uppercase tracking-wide text-[#1A1A1A] hover:text-black"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 text-xs text-[#555555] pt-2 border-t border-[#CCCCCC]">
              <Link href={`/fr`} className={lang === 'fr' ? 'text-black font-semibold' : ''}>FR</Link>
              <span>|</span>
              <Link href={`/en`} className={lang === 'en' ? 'text-black font-semibold' : ''}>EN</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
