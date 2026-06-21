import type { Comment } from '../types'
import CommentItem from './CommentItem'

interface Props {
  comments: Comment[]
}

function CommentList({ comments }: Props) {
  if (comments.length === 0) {
    return <p className="comments-empty">No comments yet.</p>
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  )
}

export default CommentList
