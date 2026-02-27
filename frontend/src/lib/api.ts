import axios from 'axios'
import type {
  Article,
  Artist,
  ArtistWithContent,
  Clip,
  Advertisement,
  ContactMessage,
  PaginatedResponse,
  SearchResults,
  ApiResponse,
} from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Interceptor pour token JWT admin
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Interceptor pour refresh automatique du token
let isRefreshing = false
let pendingRequests: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = []

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes('/auth/refresh') &&
      !original.url?.includes('/auth/login')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return apiClient(original)
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const { data } = await apiClient.post('/auth/refresh')
        const newToken = data.data.accessToken
        if (typeof window !== 'undefined') localStorage.setItem('access_token', newToken)
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
        original.headers.Authorization = `Bearer ${newToken}`
        pendingRequests.forEach((p) => p.resolve(newToken))
        pendingRequests = []
        return apiClient(original)
      } catch (refreshError) {
        pendingRequests.forEach((p) => p.reject(refreshError))
        pendingRequests = []
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token')
          window.location.href = '/admin/login'
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// ─── Articles ────────────────────────────────────────────────

export async function getArticles(params?: {
  page?: number
  limit?: number
  category?: string
  lang?: string
}): Promise<ApiResponse<PaginatedResponse<Article>>> {
  const { data } = await apiClient.get('/articles', { params })
  return data
}

export async function getArticleBySlug(slug: string): Promise<ApiResponse<Article>> {
  const { data } = await apiClient.get(`/articles/${slug}`)
  return data
}

// ─── Artists ──────────────────────────────────────────────────

export async function getArtists(params?: {
  page?: number
  limit?: number
}): Promise<ApiResponse<PaginatedResponse<Artist>>> {
  const { data } = await apiClient.get('/artists', { params })
  return data
}

export async function getArtistBySlug(slug: string): Promise<ApiResponse<ArtistWithContent>> {
  const { data } = await apiClient.get(`/artists/${slug}`)
  return data
}

// ─── Clips ────────────────────────────────────────────────────

export async function getClips(params?: {
  page?: number
  limit?: number
  artistId?: string
  sort?: 'asc' | 'desc'
}): Promise<ApiResponse<PaginatedResponse<Clip>>> {
  const { data } = await apiClient.get('/clips', { params })
  return data
}

export async function getClipBySlug(slug: string): Promise<ApiResponse<Clip>> {
  const { data } = await apiClient.get(`/clips/${slug}`)
  return data
}

// ─── Search ───────────────────────────────────────────────────

export async function search(q: string): Promise<ApiResponse<SearchResults>> {
  const { data } = await apiClient.get('/search', { params: { q } })
  return data
}

// ─── Advertisement ────────────────────────────────────────────

export async function getActiveAd(): Promise<ApiResponse<Advertisement[]>> {
  const { data } = await apiClient.get('/ads/active')
  return data
}

// ─── Contact ─────────────────────────────────────────────────

export async function sendContact(payload: {
  name: string
  email: string
  subject: string
  message: string
}): Promise<ApiResponse<{ message: string }>> {
  const { data } = await apiClient.post('/contact', payload)
  return data
}

// ─── Admin Auth ───────────────────────────────────────────────

export async function login(email: string, password: string) {
  const { data } = await apiClient.post('/auth/login', { email, password })
  return data
}

export async function logout() {
  await apiClient.post('/auth/logout')
}

export async function refreshToken() {
  const { data } = await apiClient.post('/auth/refresh')
  return data
}

// ─── Admin CRUD ───────────────────────────────────────────────

export const adminApi = {
  // Articles
  getArticles: (params?: any) => apiClient.get('/admin/articles', { params }),
  getArticle: (id: string) => apiClient.get(`/admin/articles/${id}`),
  createArticle: (payload: any) => apiClient.post('/admin/articles', payload),
  updateArticle: (id: string, payload: any) => apiClient.patch(`/admin/articles/${id}`, payload),
  deleteArticle: (id: string) => apiClient.delete(`/admin/articles/${id}`),

  // Artists
  getArtists: (params?: any) => apiClient.get('/admin/artists', { params }),
  getArtist: (id: string) => apiClient.get(`/admin/artists/${id}`),
  createArtist: (payload: any) => apiClient.post('/admin/artists', payload),
  updateArtist: (id: string, payload: any) => apiClient.patch(`/admin/artists/${id}`, payload),
  deleteArtist: (id: string) => apiClient.delete(`/admin/artists/${id}`),

  // Clips
  getClips: (params?: any) => apiClient.get('/admin/clips', { params }),
  getClip: (id: string) => apiClient.get(`/admin/clips/${id}`),
  createClip: (payload: any) => apiClient.post('/admin/clips', payload),
  updateClip: (id: string, payload: any) => apiClient.patch(`/admin/clips/${id}`, payload),
  deleteClip: (id: string) => apiClient.delete(`/admin/clips/${id}`),

  // Ads
  getAds: () => apiClient.get('/admin/ads'),
  createAd: (payload: any) => apiClient.post('/admin/ads', payload),
  updateAd: (id: string, payload: any) => apiClient.patch(`/admin/ads/${id}`, payload),
  deleteAd: (id: string) => apiClient.delete(`/admin/ads/${id}`),

  // Messages
  getMessages: () => apiClient.get('/admin/messages'),
  markMessageRead: (id: string) => apiClient.patch(`/admin/messages/${id}/read`),
  markMessageUnread: (id: string) => apiClient.patch(`/admin/messages/${id}/unread`),

  // Upload
  uploadImage: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
