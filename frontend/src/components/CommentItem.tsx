import type { Comment } from '../types'

interface Props {
  comment: Comment
}

function CommentItem({ comment }: Props) {
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

      <p className="comment-text">{comment.text}</p>

      <footer className="comment-footer">
        <span className="comment-likes">♥ {comment.likes}</span>
      </footer>
    </article>
  )
}

export default CommentItem
