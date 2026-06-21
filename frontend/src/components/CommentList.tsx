import type { Comment } from '../types'
import CommentItem from './CommentItem'

interface Props {
  comments: Comment[]
  onEdit: (id: number, text: string) => void
  onDelete: (id: number) => void
}

function CommentList({ comments, onEdit, onDelete }: Props) {
  if (comments.length === 0) {
    return <p className="comments-empty">No comments yet.</p>
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default CommentList
