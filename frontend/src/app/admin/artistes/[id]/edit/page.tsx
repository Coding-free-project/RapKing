'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import Button from '@/components/ui/Button'
import ImageUpload from '@/components/admin/ImageUpload'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function EditArtistePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [error, setError] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-artist', id],
    queryFn: () => adminApi.getArtist(id),
    enabled: !!id,
  })

  const { register, handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = useForm({
    defaultValues: { name: '', photo: '', country: '', bio: '' },
  })

  const photo = watch('photo')

  const artist = data?.data?.data

  useEffect(() => {
    if (artist) {
      reset({
        name: artist.name ?? '',
        photo: artist.photo ?? '',
        country: artist.country ?? '',
        bio: artist.bio ?? '',
      })
    }
  }, [artist, reset])

  const mutation = useMutation({
    mutationFn: (data: any) => adminApi.updateArtist(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artists'] })
      router.push('/admin/artistes')
    },
    onError: (err: any) => setError(err?.response?.data?.message || 'Erreur'),
  })

  if (isLoading) {
    return <div className="text-[#555555]">Chargement...</div>
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/artistes" className="text-[#555555] hover:text-black"><ArrowLeft size={18} /></Link>
        <h1 className="font-bebas text-4xl">Modifier l'artiste</h1>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="bg-white border border-[#CCCCCC] p-6 flex flex-col gap-5">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#555555] mb-2">Nom *</label>
          <input {...register('name', { required: true })} className="w-full border border-[#CCCCCC] px-3 py-2.5 text-sm focus:border-black outline-none" placeholder="Nom de l'artiste" />
        </div>
        <ImageUpload
          label="Photo"
          value={photo}
          onChange={(url) => setValue('photo', url)}
        />
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#555555] mb-2">Pays</label>
          <input {...register('country')} className="w-full border border-[#CCCCCC] px-3 py-2.5 text-sm focus:border-black outline-none" placeholder="France" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#555555] mb-2">Biographie</label>
          <textarea {...register('bio')} rows={4} className="w-full border border-[#CCCCCC] px-3 py-2.5 text-sm focus:border-black outline-none resize-none" />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button type="submit" loading={isSubmitting}>Enregistrer</Button>
      </form>
    </div>
  )
}
