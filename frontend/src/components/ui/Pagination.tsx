'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className={cn('flex items-center justify-center gap-2 mt-10', className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 border border-[#CCCCCC] text-[#555555] hover:border-black hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Page précédente"
      >
        <ChevronLeft size={16} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
        if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                'w-9 h-9 text-sm font-medium transition-colors border',
                page === currentPage
                  ? 'bg-black text-white border-black'
                  : 'border-[#CCCCCC] text-[#555555] hover:border-black hover:text-black',
              )}
            >
              {page}
            </button>
          )
        }
        if (Math.abs(page - currentPage) === 2) {
          return <span key={page} className="text-[#CCCCCC] px-1">…</span>
        }
        return null
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 border border-[#CCCCCC] text-[#555555] hover:border-black hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Page suivante"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
