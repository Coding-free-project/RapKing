'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { getArticles } from '@/lib/api'
import ArticleCard from '@/components/articles/ArticleCard'
import Pagination from '@/components/ui/Pagination'
import { cn } from '@/lib/utils'

interface ArticlesPageProps {
  params: { lang: string }
}

const categories = ['all', 'news', 'interview'] as const

export default function ArticlesPage({ params: { lang } }: ArticlesPageProps) {
  const t = useTranslations('articles')
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState<string>('')

  const { data, isLoading } = useQuery({
    queryKey: ['articles', page, category, lang],
    queryFn: () => getArticles({ page, limit: 12, category: category || undefined, lang }),
  })

  const articles = data?.data.data ?? []
  const meta = data?.data.meta

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10">
      <div className="flex items-baseline justify-between mb-8 border-b border-[#CCCCCC] pb-4">
        <h1 className="font-bebas text-5xl md:text-6xl">{t('title')}</h1>

        {/* Category filters */}
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat === 'all' ? '' : cat); setPage(1) }}
              className={cn(
                'text-xs uppercase tracking-widest px-3 py-1.5 transition-colors',
                (cat === 'all' && !category) || category === cat
                  ? 'bg-black text-white'
                  : 'text-[#555555] hover:text-black',
              )}
            >
              {cat === 'all' ? t('all') : cat === 'news' ? t('news') : t('interviews')}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="ratio-16-9 bg-[#F5F5F5] mb-4" />
              <div className="h-4 bg-[#F5F5F5] w-16 mb-2" />
              <div className="h-6 bg-[#F5F5F5] w-3/4" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && articles.length === 0 && (
        <p className="text-[#555555] text-center py-20">{t('noArticles')}</p>
      )}

      {!isLoading && articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} lang={lang} />
          ))}
        </div>
      )}

      {meta && (
        <Pagination
          currentPage={page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
