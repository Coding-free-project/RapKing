'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { adminApi } from '@/lib/api'
import { FileText, Users, Film, MessageSquare, Plus } from 'lucide-react'

export default function AdminDashboard() {
  const { data: articlesData } = useQuery({
    queryKey: ['admin-articles-count'],
    queryFn: () => adminApi.getArticles({ limit: 1 }),
  })
  const { data: artistsData } = useQuery({
    queryKey: ['admin-artists-count'],
    queryFn: () => adminApi.getArtists({ limit: 1 }),
  })
  const { data: clipsData } = useQuery({
    queryKey: ['admin-clips-count'],
    queryFn: () => adminApi.getClips({ limit: 1 }),
  })
  const { data: messagesData } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: () => adminApi.getMessages(),
  })

  const stats = [
    {
      label: 'Articles',
      value: articlesData?.data?.data?.meta?.total ?? '—',
      icon: FileText,
      href: '/admin/articles',
      action: '/admin/articles/new',
    },
    {
      label: 'Artistes',
      value: artistsData?.data?.data?.meta?.total ?? '—',
      icon: Users,
      href: '/admin/artistes',
      action: '/admin/artistes/new',
    },
    {
      label: 'Clips',
      value: clipsData?.data?.data?.meta?.total ?? '—',
      icon: Film,
      href: '/admin/clips',
      action: '/admin/clips/new',
    },
    {
      label: 'Messages',
      value: messagesData?.data?.data?.filter((m: any) => !m.isRead).length ?? '—',
      icon: MessageSquare,
      href: '/admin/messages',
      action: null,
    },
  ]

  return (
    <div>
      <h1 className="font-bebas text-4xl mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, href, action }) => (
          <div key={label} className="bg-white border border-[#CCCCCC] p-5">
            <div className="flex items-center justify-between mb-3">
              <Icon size={18} className="text-[#555555]" />
              {action && (
                <Link href={action} className="p-1 text-[#555555] hover:text-black transition-colors">
                  <Plus size={14} />
                </Link>
              )}
            </div>
            <p className="font-bebas text-4xl">{value}</p>
            <Link href={href} className="text-xs text-[#555555] hover:text-black uppercase tracking-widest transition-colors">
              {label} →
            </Link>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white border border-[#CCCCCC] p-6">
        <h2 className="font-bebas text-2xl mb-4">Actions rapides</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/articles/new" className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 text-sm uppercase tracking-wide hover:bg-[#1A1A1A] transition-colors">
            <Plus size={14} /> Nouvel article
          </Link>
          <Link href="/admin/artistes/new" className="inline-flex items-center gap-2 border border-black px-4 py-2 text-sm uppercase tracking-wide hover:bg-black hover:text-white transition-colors">
            <Plus size={14} /> Nouvel artiste
          </Link>
          <Link href="/admin/clips/new" className="inline-flex items-center gap-2 border border-black px-4 py-2 text-sm uppercase tracking-wide hover:bg-black hover:text-white transition-colors">
            <Plus size={14} /> Nouveau clip
          </Link>
        </div>
      </div>
    </div>
  )
}
