import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface PostFormProps {
  initialTitle?: string
  initialContent?: string
  submitLabel: string
  submittingLabel: string
  onSubmit: (title: string, content: string) => Promise<string | null>
  onCancel: () => void
}

export const PostForm = ({
  initialTitle = '',
  initialContent = '',
  submitLabel,
  submittingLabel,
  onSubmit,
  onCancel,
}: PostFormProps) => {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (title.trim().length === 0) {
      setError('제목을 입력해주세요.')
      return
    }

    if (content.trim().length === 0) {
      setError('내용을 입력해주세요.')
      return
    }

    setSubmitting(true)
    const submitError = await onSubmit(title.trim(), content.trim())
    setSubmitting(false)

    if (submitError) {
      setError(submitError)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
          제목
        </label>
        <Input
          id="title"
          maxLength={200}
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-1 block text-sm font-medium text-gray-700">
          내용
        </label>
        <textarea
          id="content"
          rows={10}
          required
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? submittingLabel : submitLabel}
        </Button>
      </div>
    </form>
  )
}
