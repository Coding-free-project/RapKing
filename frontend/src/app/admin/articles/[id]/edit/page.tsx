'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import TipTapEditor from '@/components/admin/TipTapEditor'
import Button from '@/components/ui/Button'
import ImageUpload from '@/components/admin/ImageUpload'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [error, setError] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-article', id],
    queryFn: () => adminApi.getArticle(id),
    enabled: !!id,
  })

  const { data: artistsData } = useQuery({
    queryKey: ['admin-artists-list'],
    queryFn: () => adminApi.getArtists({ limit: 100 }),
  })
  const artists = artistsData?.data?.data?.data ?? []

  const { register, handleSubmit, control, reset, watch, setValue, formState: { isSubmitting } } = useForm({
    defaultValues: {
      title: '',
      content: '',
      coverImage: '',
      category: 'news',
      published: false,
      lang: 'fr',
      metaTitle: '',
      metaDescription: '',
      artistId: '',
    },
  })

  const article = data?.data?.data

  useEffect(() => {
    if (article) {
      reset({
        title: article.title ?? '',
        content: article.content ?? '',
        coverImage: article.coverImage ?? '',
        category: article.category ?? 'news',
        published: article.published ?? false,
        lang: article.lang ?? 'fr',
        metaTitle: article.metaTitle ?? '',
        metaDescription: article.metaDescription ?? '',
        artistId: article.artistId ?? '',
      })
    }
  }, [article, reset])

  const mutation = useMutation({
    mutationFn: (data: any) => adminApi.updateArticle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
      router.push('/admin/articles')
    },
    onError: (err: any) => setError(err?.response?.data?.message || 'Erreur'),
  })

  const coverImage = watch('coverImage')

  const onSubmit = (data: any) => {
    const payload = { ...data, artistId: data.artistId || undefined }
    mutation.mutate(payload)
  }

  if (isLoading) {
    return <div className="text-[#555555]">Chargement...</div>
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/articles" className="text-[#555555] hover:text-black"><ArrowLeft size={18} /></Link>
        <h1 className="font-bebas text-4xl">Modifier l'article</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="bg-white border border-[#CCCCCC] p-5">
              <label className="block text-xs uppercase tracking-widest text-[#555555] mb-2">Titre *</label>
              <input
                {...register('title', { required: true })}
                className="w-full border border-[#CCCCCC] px-3 py-2.5 text-sm focus:border-black outline-none"
                placeholder="Titre de l'article"
              />
            </div>

            <div className="bg-white border border-[#CCCCCC] p-5">
              <label className="block text-xs uppercase tracking-widest text-[#555555] mb-2">Contenu *</label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TipTapEditor
                    content={field.value}
                    onChange={field.onChange}
                    placeholder="Écrivez votre article ici..."
                  />
                )}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-[#CCCCCC] p-5">
              <h3 className="text-xs uppercase tracking-widest text-[#555555] mb-4">Publication</h3>
              <div className="flex items-center gap-2 mb-4">
                <input type="checkbox" {...register('published')} id="published" className="w-4 h-4" />
                <label htmlFor="published" className="text-sm">Publié</label>
              </div>
              <Button type="submit" loading={isSubmitting} className="w-full">
                Enregistrer
              </Button>
            </div>

            <div className="bg-white border border-[#CCCCCC] p-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#555555] mb-2">Catégorie</label>
                <select {...register('category')} className="w-full border border-[#CCCCCC] px-3 py-2 text-sm focus:border-black outline-none">
                  <option value="news">News</option>
                  <option value="interview">Interview</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#555555] mb-2">Langue</label>
                <select {...register('lang')} className="w-full border border-[#CCCCCC] px-3 py-2 text-sm focus:border-black outline-none">
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#555555] mb-2">Artiste</label>
                <select {...register('artistId')} className="w-full border border-[#CCCCCC] px-3 py-2 text-sm focus:border-black outline-none">
                  <option value="">— Aucun —</option>
                  {artists.map((a: any) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white border border-[#CCCCCC] p-5">
              <ImageUpload
                label="Image de couverture"
                value={coverImage}
                onChange={(url) => setValue('coverImage', url)}
              />
            </div>

            <div className="bg-white border border-[#CCCCCC] p-5 flex flex-col gap-4">
              <h3 className="text-xs uppercase tracking-widest text-[#555555] mb-1">SEO</h3>
              <div>
                <label className="block text-xs text-[#555555] mb-1">Meta title</label>
                <input {...register('metaTitle')} className="w-full border border-[#CCCCCC] px-3 py-2 text-sm focus:border-black outline-none" />
              </div>
              <div>
                <label className="block text-xs text-[#555555] mb-1">Meta description (max 160)</label>
                <textarea {...register('metaDescription')} rows={3} maxLength={160} className="w-full border border-[#CCCCCC] px-3 py-2 text-sm focus:border-black outline-none resize-none" />
              </div>
            </div>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  )
}
