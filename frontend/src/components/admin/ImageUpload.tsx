'use client'

import { useRef, useState } from 'react'
import { adminApi } from '@/lib/api'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file: File) => {
    setError('')
    setLoading(true)
    try {
      const res = await adminApi.uploadImage(file)
      console.log('upload res:', res)
      console.log('upload res.data:', res.data)
      onChange(res.data.data.url)
    } catch {
      setError('Erreur lors de l\'upload')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="block text-xs uppercase tracking-widest text-[#555555]">{label}</label>
      )}

      {value ? (
        <div className="relative border border-[#CCCCCC] overflow-hidden">
          <Image
            src={value}
            alt="Aperçu"
            width={400}
            height={200}
            className="w-full object-cover max-h-48"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-black text-white p-1 hover:bg-[#333]"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border border-dashed border-[#CCCCCC] p-8 flex flex-col items-center gap-2 cursor-pointer hover:border-black transition-colors"
        >
          {loading ? (
            <p className="text-sm text-[#555555]">Upload en cours...</p>
          ) : (
            <>
              <Upload size={20} className="text-[#555555]" />
              <p className="text-sm text-[#555555]">Cliquer ou déposer une image</p>
              <p className="text-xs text-[#999]">JPG, PNG, WebP — max 5MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />

      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  )
}
