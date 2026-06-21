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

  function handleSave() {
    onEdit(comment.id, draft)
    setIsEditing(false)
  }

  function handleCancel() {
    setDraft(comment.text) // discard edits
    setIsEditing(false)
  }

  return (
    <article className="comment">
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
              <button type="button" onClick={handleSave}>
                Save
              </button>
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => setIsEditing(true)}>
                Edit
              </button>
              <button type="button" onClick={() => onDelete(comment.id)}>
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
