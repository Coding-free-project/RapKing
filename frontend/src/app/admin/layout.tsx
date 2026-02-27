'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, FileText, Users, Film, Megaphone, MessageSquare, LogOut, Menu, X } from 'lucide-react'
import QueryProvider from '@/components/providers/QueryProvider'
import { logout } from '@/lib/api'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/articles', label: 'Articles', icon: FileText },
  { href: '/admin/artistes', label: 'Artistes', icon: Users },
  { href: '/admin/clips', label: 'Clips', icon: Film },
  { href: '/admin/publicites', label: 'Publicités', icon: Megaphone },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token && pathname !== '/admin/login') {
      router.replace('/admin/login')
    } else {
      setIsAuth(true)
    }
  }, [pathname, router])

  const handleLogout = async () => {
    await logout()
    localStorage.removeItem('access_token')
    router.replace('/admin/login')
  }

  if (pathname === '/admin/login') {
    return (
      <QueryProvider>
        <div className="min-h-screen bg-[#F5F5F5]">{children}</div>
      </QueryProvider>
    )
  }

  if (!isAuth) return null

  return (
    <QueryProvider>
      <div className="min-h-screen flex bg-[#F5F5F5]">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed md:sticky top-0 left-0 h-screen w-60 bg-black text-white flex flex-col z-50
          transform transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="px-6 py-5 border-b border-[#1A1A1A]">
            <Link href="/admin" className="font-bebas text-2xl tracking-widest">RAPKING ADMIN</Link>
          </div>

          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded text-sm mb-1 transition-colors
                  ${pathname === href
                    ? 'bg-white text-black font-medium'
                    : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
                  }
                `}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-4 text-sm text-gray-400 hover:text-white transition-colors border-t border-[#1A1A1A]"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <header className="bg-white border-b border-[#CCCCCC] px-4 md:px-6 py-4 flex items-center justify-between md:justify-end">
            <button
              className="md:hidden p-1 text-[#555555]"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="text-xs text-[#555555] uppercase tracking-widest">
              Back-office
            </div>
          </header>

          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </QueryProvider>
  )
}
