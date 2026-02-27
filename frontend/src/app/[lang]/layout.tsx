import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AdBanner from '@/components/ads/AdBanner'
import QueryProvider from '@/components/providers/QueryProvider'

const locales = ['fr', 'en']

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function LangLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  if (!locales.includes(lang)) notFound()
  setRequestLocale(lang)

  const messages = await getMessages()

  return (
    <html lang={lang}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <AdBanner />
            <Header lang={lang} />
            <main>{children}</main>
            <Footer lang={lang} />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
