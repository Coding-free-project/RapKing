export type Lang = 'fr' | 'en'
export type ArticleCategory = 'news' | 'interview'
export type AdType = 'image' | 'script'

export interface Artist {
  id: string
  name: string
  slug: string
  photo: string | null
  country: string | null
  bio: string | null
  createdAt: string
  updatedAt: string
}

export interface ArtistWithContent extends Artist {
  articles: Article[]
  clips: Clip[]
  _count?: { articles: number; clips: number }
}

export interface Article {
  id: string
  title: string
  slug: string
  content: string
  coverImage: string | null
  category: ArticleCategory
  published: boolean
  publishedAt: string | null
  lang: Lang
  metaTitle: string | null
  metaDescription: string | null
  artistId: string | null
  artist?: Pick<Artist, 'id' | 'name' | 'slug'> | null
  createdAt: string
  updatedAt: string
}

export interface Clip {
  id: string
  title: string
  slug: string
  youtubeUrl: string
  youtubeId: string
  artistId: string
  artist: Pick<Artist, 'id' | 'name' | 'slug'>
  publishedAt: string
  createdAt: string
  updatedAt: string
}

export interface Advertisement {
  id: string
  name: string
  type: AdType
  imageUrl: string | null
  linkUrl: string | null
  scriptCode: string | null
  position: 'top_banner'
  isActive: boolean
  startDate: string | null
  endDate: string | null
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  isRead: boolean
  createdAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface SearchResults {
  articles: Pick<Article, 'id' | 'title' | 'slug' | 'coverImage' | 'category' | 'publishedAt'>[]
  artists: Pick<Artist, 'id' | 'name' | 'slug' | 'photo' | 'country'>[]
  clips: Clip[]
}

export interface ApiResponse<T> {
  success: boolean
  data: T
}
