'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Article } from '@/types'

export default function AdminArticlesPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-articles', page],
    queryFn: () => adminApi.getArticles({ page, limit: 15 }),
  })

  const articles: Article[] = data?.data?.data?.data ?? []
  const meta = data?.data?.data?.meta

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteArticle(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-articles'] }),
  })

  const togglePublish = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      adminApi.updateArticle(id, { published }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-articles'] }),
  })

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer cet article ?')) deleteMutation.mutate(id)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bebas text-4xl">Articles</h1>
        <Link href="/admin/articles/new" className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 text-sm uppercase tracking-wide hover:bg-[#1A1A1A] transition-colors">
          <Plus size={14} /> Nouveau
        </Link>
      </div>

      <div className="bg-white border border-[#CCCCCC]">
        {isLoading ? (
          <div className="p-8 text-center text-[#555555]">Chargement...</div>
        ) : articles.length === 0 ? (
          <div className="p-8 text-center text-[#555555]">Aucun article</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-[#CCCCCC] bg-[#F5F5F5]">
              <tr>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#555555]">Titre</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#555555] hidden md:table-cell">Catégorie</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#555555] hidden lg:table-cell">Date</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#555555]">Statut</th>
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-[#F5F5F5] hover:bg-[#F5F5F5] transition-colors">
                  <td className="px-4 py-3 font-medium text-[#1A1A1A] max-w-[200px] truncate">{article.title}</td>
                  <td className="px-4 py-3 text-[#555555] capitalize hidden md:table-cell">{article.category}</td>
                  <td className="px-4 py-3 text-[#555555] hidden lg:table-cell">
                    {article.publishedAt ? formatDate(article.publishedAt) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublish.mutate({ id: article.id, published: !article.published })}
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 ${
                        article.published ? 'bg-black text-white' : 'border border-[#CCCCCC] text-[#555555]'
                      }`}
                    >
                      {article.published ? <Eye size={10} /> : <EyeOff size={10} />}
                      {article.published ? 'Publié' : 'Brouillon'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/admin/articles/${article.id}/edit`} className="p-1 text-[#555555] hover:text-black transition-colors">
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="p-1 text-[#555555] hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-[#CCCCCC]">
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 text-xs ${page === p ? 'bg-black text-white' : 'border border-[#CCCCCC] text-[#555555] hover:border-black'}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
