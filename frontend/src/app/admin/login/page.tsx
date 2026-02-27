'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { apiClient } from '@/lib/api'
import Button from '@/components/ui/Button'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type LoginForm = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (formData: LoginForm) => {
    setError('')
    try {
      const response = await apiClient.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      })
      const token = response.data?.data?.accessToken
      if (token) {
        localStorage.setItem('access_token', token)
        window.location.href = '/admin'
      } else {
        setError('Erreur de connexion, veuillez réessayer')
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Identifiants invalides')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-bebas text-5xl tracking-widest">RAPKING</h1>
          <p className="text-[#555555] text-sm mt-1 uppercase tracking-widest">Administration</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-[#CCCCCC] p-8 flex flex-col gap-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#555555] mb-2">Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="admin@rapking.com"
              className="w-full border border-[#CCCCCC] px-4 py-3 text-sm focus:border-black outline-none transition-colors"
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#555555] mb-2">Mot de passe</label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full border border-[#CCCCCC] px-4 py-3 text-sm focus:border-black outline-none transition-colors"
            />
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
      </div>
    </div>
  )
}
