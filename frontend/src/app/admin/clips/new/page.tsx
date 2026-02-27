'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewClipPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  const { data: artistsData } = useQuery({
    queryKey: ['admin-artists-list'],
    queryFn: () => adminApi.getArtists({ limit: 100 }),
  })
  const artists = artistsData?.data?.data?.data ?? []

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { title: '', youtubeUrl: '', artistId: '' },
  })

  const mutation = useMutation({
    mutationFn: (data: any) => adminApi.createClip(data),
    onSuccess: () => router.push('/admin/clips'),
    onError: (err: any) => setError(err?.response?.data?.message || 'Erreur'),
  })

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/clips" className="text-[#555555] hover:text-black"><ArrowLeft size={18} /></Link>
        <h1 className="font-bebas text-4xl">Nouveau clip</h1>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="bg-white border border-[#CCCCCC] p-6 flex flex-col gap-5">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#555555] mb-2">Titre *</label>
          <input {...register('title', { required: true })} className="w-full border border-[#CCCCCC] px-3 py-2.5 text-sm focus:border-black outline-none" placeholder="Titre du clip" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#555555] mb-2">URL YouTube *</label>
          <input {...register('youtubeUrl', { required: true })} className="w-full border border-[#CCCCCC] px-3 py-2.5 text-sm focus:border-black outline-none" placeholder="https://www.youtube.com/watch?v=..." />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#555555] mb-2">Artiste *</label>
          <select {...register('artistId', { required: true })} className="w-full border border-[#CCCCCC] px-3 py-2.5 text-sm focus:border-black outline-none">
            <option value="">— Sélectionner —</option>
            {artists.map((a: any) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button type="submit" loading={isSubmitting}>Ajouter le clip</Button>
      </form>
    </div>
  )
}
