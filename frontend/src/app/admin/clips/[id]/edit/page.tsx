'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function EditClipPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [error, setError] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-clip', id],
    queryFn: () => adminApi.getClip(id),
    enabled: !!id,
  })

  const { data: artistsData } = useQuery({
    queryKey: ['admin-artists-list'],
    queryFn: () => adminApi.getArtists({ limit: 100 }),
  })
  const artists = artistsData?.data?.data?.data ?? []

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: { title: '', youtubeUrl: '', artistId: '' },
  })

  const clip = data?.data?.data

  useEffect(() => {
    if (clip) {
      reset({
        title: clip.title ?? '',
        youtubeUrl: clip.youtubeUrl ?? '',
        artistId: clip.artistId ?? '',
      })
    }
  }, [clip, reset])

  const mutation = useMutation({
    mutationFn: (data: any) => adminApi.updateClip(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clips'] })
      router.push('/admin/clips')
    },
    onError: (err: any) => setError(err?.response?.data?.message || 'Erreur'),
  })

  if (isLoading) {
    return <div className="text-[#555555]">Chargement...</div>
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/clips" className="text-[#555555] hover:text-black"><ArrowLeft size={18} /></Link>
        <h1 className="font-bebas text-4xl">Modifier le clip</h1>
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
        <Button type="submit" loading={isSubmitting}>Enregistrer</Button>
      </form>
    </div>
  )
}
