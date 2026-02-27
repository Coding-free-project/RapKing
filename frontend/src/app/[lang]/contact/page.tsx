'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { sendContact } from '@/lib/api'
import Button from '@/components/ui/Button'

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(2000),
})

type ContactForm = z.infer<typeof contactSchema>

interface ContactPageProps {
  params: { lang: string }
}

export default function ContactPage({ params: { lang } }: ContactPageProps) {
  const t = useTranslations('contact')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) })

  const onSubmit = async (data: ContactForm) => {
    setError(false)
    try {
      await sendContact(data)
      setSuccess(true)
      reset()
    } catch {
      setError(true)
    }
  }

  return (
    <div className="max-w-[600px] mx-auto px-4 md:px-6 py-10">
      <h1 className="font-bebas text-5xl md:text-6xl mb-2">{t('title')}</h1>
      <p className="text-[#555555] mb-10">{t('subtitle')}</p>

      {success ? (
        <div className="bg-[#F5F5F5] border border-[#CCCCCC] p-6 text-center">
          <p className="text-[#1A1A1A] font-medium">{t('success')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
          {/* Name */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#555555] mb-2">{t('name')}</label>
            <input
              {...register('name')}
              placeholder={t('namePlaceholder')}
              className="w-full border border-[#CCCCCC] px-4 py-3 text-sm focus:border-black outline-none transition-colors"
            />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#555555] mb-2">{t('email')}</label>
            <input
              {...register('email')}
              type="email"
              placeholder={t('emailPlaceholder')}
              className="w-full border border-[#CCCCCC] px-4 py-3 text-sm focus:border-black outline-none transition-colors"
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#555555] mb-2">{t('subject')}</label>
            <input
              {...register('subject')}
              placeholder={t('subjectPlaceholder')}
              className="w-full border border-[#CCCCCC] px-4 py-3 text-sm focus:border-black outline-none transition-colors"
            />
            {errors.subject && <p className="text-red-600 text-xs mt-1">{errors.subject.message}</p>}
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#555555] mb-2">{t('message')}</label>
            <textarea
              {...register('message')}
              rows={6}
              placeholder={t('messagePlaceholder')}
              className="w-full border border-[#CCCCCC] px-4 py-3 text-sm focus:border-black outline-none transition-colors resize-none"
            />
            {errors.message && <p className="text-red-600 text-xs mt-1">{errors.message.message}</p>}
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{t('error')}</p>
          )}

          <Button type="submit" loading={isSubmitting} size="lg">
            {isSubmitting ? t('sending') : t('send')}
          </Button>
        </form>
      )}
    </div>
  )
}
