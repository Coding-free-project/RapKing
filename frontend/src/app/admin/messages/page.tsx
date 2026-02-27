'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import { Mail, MailOpen } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { ContactMessage } from '@/types'

export default function AdminMessagesPage() {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: () => adminApi.getMessages(),
    placeholderData: (prev: any) => prev,
  })

  const messages: ContactMessage[] = data?.data?.data ?? []
  const unreadCount = messages.filter((m) => !m.isRead).length

  const toggleMutation = useMutation({
    mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) =>
      isRead ? adminApi.markMessageUnread(id) : adminApi.markMessageRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-messages'] }),
  })

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h1 className="font-bebas text-4xl">Messages Contact</h1>
        {unreadCount > 0 && (
          <span className="bg-black text-white text-xs px-2 py-0.5">{unreadCount} non lus</span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="bg-white border border-[#CCCCCC] p-8 text-center text-[#555555]">Aucun message</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`bg-white border p-5 ${!msg.isRead ? 'border-black' : 'border-[#CCCCCC]'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    {!msg.isRead
                      ? <Mail size={14} className="text-black flex-shrink-0" />
                      : <MailOpen size={14} className="text-[#555555] flex-shrink-0" />
                    }
                    <p className="font-semibold text-sm truncate">{msg.name} — {msg.email}</p>
                    <span className="text-xs text-[#555555] flex-shrink-0">{formatDate(msg.createdAt)}</span>
                  </div>
                  <p className="text-sm font-medium text-[#1A1A1A] mb-2">{msg.subject}</p>
                  <p className="text-sm text-[#555555] whitespace-pre-line">{msg.message}</p>
                </div>
                <button
                  onClick={() => toggleMutation.mutate({ id: msg.id, isRead: msg.isRead })}
                  disabled={toggleMutation.isPending}
                  className="text-xs uppercase tracking-widest text-[#555555] hover:text-black flex-shrink-0 border border-[#CCCCCC] px-2 py-1 hover:border-black transition-colors disabled:opacity-50"
                >
                  {msg.isRead ? 'Non lu' : 'Marquer lu'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
