import { useState } from 'react'

interface Props {
  onAdd: (text: string) => void
}

function CommentForm({ onAdd }: Props) {
  const [text, setText] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(text)
    setText('')
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        className="comment-form-input"
        placeholder="Add a comment as Admin…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="btn btn-primary comment-form-submit">
        Add Comment
      </button>
    </form>
  )
}

export default CommentForm
