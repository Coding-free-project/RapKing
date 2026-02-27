'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import { Plus, Trash2, Eye, EyeOff, Pencil, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import ImageUpload from '@/components/admin/ImageUpload'
import type { Advertisement } from '@/types'

const emptyForm = { name: '', type: 'image', imageUrl: '', linkUrl: '', scriptCode: '', isActive: false }

export default function AdminPublicitesPage() {
  const queryClient = useQueryClient()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState({ ...emptyForm })
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null)
  const [editForm, setEditForm] = useState({ ...emptyForm })
  const [error, setError] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-ads'],
    queryFn: () => adminApi.getAds(),
  })

  const ads: Advertisement[] = data?.data?.data ?? []

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteAd(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-ads'] }),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => adminApi.updateAd(id, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-ads'] }),
  })

  const createMutation = useMutation({
    mutationFn: (payload: any) => adminApi.createAd(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ads'] })
      setShowCreateForm(false)
      setCreateForm({ ...emptyForm })
      setError('')
    },
    onError: (err: any) => setError(err?.response?.data?.message || 'Erreur'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => adminApi.updateAd(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ads'] })
      setEditingAd(null)
      setError('')
    },
    onError: (err: any) => setError(err?.response?.data?.message || 'Erreur'),
  })

  const openEdit = (ad: Advertisement) => {
    setEditingAd(ad)
    setEditForm({
      name: ad.name,
      type: ad.type,
      imageUrl: ad.imageUrl ?? '',
      linkUrl: ad.linkUrl ?? '',
      scriptCode: ad.scriptCode ?? '',
      isActive: ad.isActive,
    })
    setShowCreateForm(false)
    setError('')
  }

  const AdForm = ({
    form,
    setForm,
    onSubmit,
    isPending,
    onCancel,
    title,
    submitLabel,
  }: {
    form: typeof emptyForm
    setForm: React.Dispatch<React.SetStateAction<typeof emptyForm>>
    onSubmit: () => void
    isPending: boolean
    onCancel: () => void
    title: string
    submitLabel: string
  }) => (
    <div className="bg-white border border-[#CCCCCC] p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bebas text-2xl">{title}</h2>
        <button onClick={onCancel} className="text-[#555555] hover:text-black"><X size={16} /></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#555555] mb-2">Nom</label>
          <input
            value={form.name}
            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full border border-[#CCCCCC] px-3 py-2 text-sm focus:border-black outline-none"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#555555] mb-2">Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
            className="w-full border border-[#CCCCCC] px-3 py-2 text-sm focus:border-black outline-none"
          >
            <option value="image">Image</option>
            <option value="script">Script</option>
          </select>
        </div>
        {form.type === 'image' && (
          <>
            <div className="md:col-span-2">
              <ImageUpload
                label="Image"
                value={form.imageUrl}
                onChange={(url) => setForm(f => ({ ...f, imageUrl: url }))}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-[#555555] mb-2">URL Lien</label>
              <input
                value={form.linkUrl}
                onChange={(e) => setForm(f => ({ ...f, linkUrl: e.target.value }))}
                className="w-full border border-[#CCCCCC] px-3 py-2 text-sm focus:border-black outline-none"
                placeholder="https://..."
              />
            </div>
          </>
        )}
        {form.type === 'script' && (
          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-widest text-[#555555] mb-2">Code script</label>
            <textarea
              value={form.scriptCode}
              onChange={(e) => setForm(f => ({ ...f, scriptCode: e.target.value }))}
              rows={4}
              className="w-full border border-[#CCCCCC] px-3 py-2 text-sm focus:border-black outline-none resize-none font-mono text-xs"
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          id={`isActive-${title}`}
          checked={form.isActive}
          onChange={(e) => setForm(f => ({ ...f, isActive: e.target.checked }))}
        />
        <label htmlFor={`isActive-${title}`} className="text-sm">Actif</label>
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      <div className="flex gap-3 mt-4">
        <Button onClick={onSubmit} loading={isPending}>{submitLabel}</Button>
        <button onClick={onCancel} className="text-sm text-[#555555] hover:text-black">Annuler</button>
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bebas text-4xl">Publicités</h1>
        <button
          onClick={() => { setShowCreateForm(!showCreateForm); setEditingAd(null); setError('') }}
          className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 text-sm uppercase tracking-wide hover:bg-[#1A1A1A] transition-colors"
        >
          <Plus size={14} /> Nouvelle pub
        </button>
      </div>

      {showCreateForm && (
        <AdForm
          form={createForm}
          setForm={setCreateForm}
          onSubmit={() => createMutation.mutate(createForm)}
          isPending={createMutation.isPending}
          onCancel={() => { setShowCreateForm(false); setError('') }}
          title="Nouvelle publicité"
          submitLabel="Créer"
        />
      )}

      {editingAd && (
        <AdForm
          form={editForm}
          setForm={setEditForm}
          onSubmit={() => updateMutation.mutate({ id: editingAd.id, payload: editForm })}
          isPending={updateMutation.isPending}
          onCancel={() => { setEditingAd(null); setError('') }}
          title={`Modifier — ${editingAd.name}`}
          submitLabel="Enregistrer"
        />
      )}

      <div className="bg-white border border-[#CCCCCC]">
        {isLoading ? (
          <div className="p-8 text-center text-[#555555]">Chargement...</div>
        ) : ads.length === 0 ? (
          <div className="p-8 text-center text-[#555555]">Aucune publicité</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-[#CCCCCC] bg-[#F5F5F5]">
              <tr>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#555555]">Nom</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#555555]">Type</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#555555]">Image</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#555555]">Statut</th>
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad.id} className={`border-b border-[#F5F5F5] transition-colors ${editingAd?.id === ad.id ? 'bg-[#F5F5F5]' : 'hover:bg-[#F5F5F5]'}`}>
                  <td className="px-4 py-3 font-medium">{ad.name}</td>
                  <td className="px-4 py-3 text-[#555555] capitalize">{ad.type}</td>
                  <td className="px-4 py-3">
                    {ad.type === 'image' ? (
                      ad.imageUrl
                        ? <span className="text-xs text-green-700 font-medium">OK</span>
                        : <span className="text-xs text-red-600 font-medium">Manquante</span>
                    ) : (
                      <span className="text-xs text-[#555555]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleMutation.mutate({ id: ad.id, isActive: !ad.isActive })}
                      disabled={toggleMutation.isPending}
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 disabled:opacity-50 ${ad.isActive ? 'bg-black text-white' : 'border border-[#CCCCCC] text-[#555555]'}`}
                    >
                      {ad.isActive ? <Eye size={10} /> : <EyeOff size={10} />}
                      {ad.isActive ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openEdit(ad)}
                        className="p-1 text-[#555555] hover:text-black"
                        title="Modifier"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => window.confirm('Supprimer cette publicité ?') && deleteMutation.mutate(ad.id)}
                        className="p-1 text-[#555555] hover:text-red-600"
                        title="Supprimer"
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
      </div>
    </div>
  )
}
