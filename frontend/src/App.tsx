import './App.css'

import { useState, useEffect } from 'react'
import type { Comment } from './types'
import { getComments, addComment, editComment, deleteComment } from './api/comments'
import CommentList from './components/CommentList'
import CommentForm from './components/CommentForm'
import ConstructionLoader from './components/ConstructionLoader'


function App() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadComments() {
    setLoading(true)
    setError(null)
    try {
      const data = await getComments()
      setComments(data)
    } catch {
      setError('Failed to load comments. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComments()
  }, [])

  // Each mutation calls the API and then re-fetches the list
  async function handleAdd(text: string) {
    await addComment(text, '')
    await loadComments()
  }

  async function handleEdit(id: number, text: string) {
    await editComment(id, text)
    await loadComments()
  }

  async function handleDelete(id: number) {
    await deleteComment(id)
    await loadComments()
  }

  return (
    <main>
      <h1>Comments</h1>
      <CommentForm onAdd={handleAdd} />
      {loading && <ConstructionLoader />}
      {error && (
        <div className="site-error" role="alert">
          <span className="site-cone">🚧</span>
          <p>{error}</p>
        </div>
      )}
      {!loading && !error && (
        <CommentList
          comments={comments}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </main>
  )
}

export default App
