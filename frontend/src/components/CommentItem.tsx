import { useState } from 'react'
import type { Comment } from '../types'

interface Props {
  comment: Comment
  onEdit: (id: number, text: string) => void
  onDelete: (id: number) => void
}

function CommentItem({ comment, onEdit, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(comment.text)
  const [isDemolishing, setIsDemolishing] = useState(false)

  function handleSave() {
    onEdit(comment.id, draft)
    setIsEditing(false)
  }

  function handleCancel() {
    setDraft(comment.text) // discard edits
    setIsEditing(false)
  }

  function handleDelete() {
    // Respect reduced-motion: skip the demolition animation, delete immediately.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      onDelete(comment.id)
    } else {
      setIsDemolishing(true) // play the wrecking-ball animation; delete on its end
    }
  }

  return (
    <article
      className={`comment ${isDemolishing ? 'demolishing' : ''}`}
      onAnimationEnd={(e) => {
        if (e.animationName === 'crumble') onDelete(comment.id)
      }}
    >
      {isDemolishing && (
        <div className="wrecking" aria-hidden="true">
          <svg viewBox="0 0 60 130" width="48" height="104">
            <line x1="30" y1="0" x2="30" y2="86" stroke="#555" strokeWidth="3" />
            <circle cx="30" cy="104" r="20" fill="#3a3a3a" />
            <circle cx="23" cy="97" r="6" fill="#5a5a5a" />
          </svg>
        </div>
      )}

      <header className="comment-header">
        {comment.image && (
          <img className="comment-avatar" src={comment.image} alt={comment.author} />
        )}
        <div className="comment-meta">
          <span className="comment-author">{comment.author}</span>
          <span className="comment-date">{comment.date}</span>
        </div>
      </header>

      {isEditing ? (
        <textarea
          className="comment-edit-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
      ) : (
        <p className="comment-text">{comment.text}</p>
      )}

      <footer className="comment-footer">
        <span className="comment-likes">♥ {comment.likes}</span>
        <span className="comment-actions">
          {isEditing ? (
            <>
              <button type="button" className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
              <button type="button" className="btn btn-outline" onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setDraft(comment.text)
                  setIsEditing(true)
                }}
              >
                Edit
              </button>
              <button type="button" className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </>
          )}
        </span>
      </footer>
    </article>
  )
}

export default CommentItem
