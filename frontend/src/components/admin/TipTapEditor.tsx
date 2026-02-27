'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold, Italic, List, ListOrdered, Quote, Heading2, Heading3,
  Link as LinkIcon, Image as ImageIcon, Undo, Redo, Code,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TipTapEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function TipTapEditor({ content, onChange, placeholder }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder || 'Écrivez votre article ici...' }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'min-h-[400px] p-4 outline-none article-content prose max-w-none',
      },
    },
  })

  if (!editor) return null

  const ToolbarButton = ({
    onClick,
    active,
    children,
  }: {
    onClick: () => void
    active?: boolean
    children: React.ReactNode
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'p-1.5 rounded hover:bg-[#F5F5F5] transition-colors',
        active && 'bg-black text-white hover:bg-black',
      )}
    >
      {children}
    </button>
  )

  const addLink = () => {
    const url = window.prompt('URL :')
    if (url) editor.chain().focus().setLink({ href: url }).run()
  }

  const addImage = () => {
    const url = window.prompt('URL de l\'image :')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }

  return (
    <div className="border border-[#CCCCCC] focus-within:border-black transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 p-2 border-b border-[#CCCCCC] bg-[#F5F5F5]">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()}><Undo size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()}><Redo size={14} /></ToolbarButton>

        <div className="w-px bg-[#CCCCCC] mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
        ><Heading2 size={14} /></ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
        ><Heading3 size={14} /></ToolbarButton>

        <div className="w-px bg-[#CCCCCC] mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        ><Bold size={14} /></ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        ><Italic size={14} /></ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
        ><Code size={14} /></ToolbarButton>

        <div className="w-px bg-[#CCCCCC] mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        ><List size={14} /></ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        ><ListOrdered size={14} /></ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
        ><Quote size={14} /></ToolbarButton>

        <div className="w-px bg-[#CCCCCC] mx-1" />

        <ToolbarButton onClick={addLink}><LinkIcon size={14} /></ToolbarButton>
        <ToolbarButton onClick={addImage}><ImageIcon size={14} /></ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="bg-white" />
    </div>
  )
}
