'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import type { Artist } from '@/types'

export default function AdminArtistesPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-artists'],
    queryFn: () => adminApi.getArtists({ limit: 100 }),
  })

  const artists: Artist[] = data?.data?.data?.data ?? []

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteArtist(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-artists'] }),
  })

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer cet artiste ?')) deleteMutation.mutate(id)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bebas text-4xl">Artistes</h1>
        <Link href="/admin/artistes/new" className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 text-sm uppercase tracking-wide hover:bg-[#1A1A1A] transition-colors">
          <Plus size={14} /> Nouveau
        </Link>
      </div>

      <div className="bg-white border border-[#CCCCCC]">
        {isLoading ? (
          <div className="p-8 text-center text-[#555555]">Chargement...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-[#CCCCCC] bg-[#F5F5F5]">
              <tr>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#555555]">Artiste</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#555555] hidden md:table-cell">Pays</th>
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {artists.map((artist) => (
                <tr key={artist.id} className="border-b border-[#F5F5F5] hover:bg-[#F5F5F5] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {artist.photo ? (
                        <Image src={artist.photo} alt={artist.name} width={32} height={32} className="object-cover rounded-full flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 bg-[#F5F5F5] rounded-full flex items-center justify-center text-xs font-bold text-[#555555]">
                          {artist.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium">{artist.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#555555] hidden md:table-cell">{artist.country || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/admin/artistes/${artist.id}/edit`} className="p-1 text-[#555555] hover:text-black">
                        <Pencil size={14} />
                      </Link>
                      <button onClick={() => handleDelete(artist.id)} className="p-1 text-[#555555] hover:text-red-600">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
