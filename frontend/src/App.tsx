import './App.css'

import { useState, useEffect } from 'react'
import type { Comment } from './types'
import { getComments } from './api/comments'
import CommentList from './components/CommentList'


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

  return (
    <main>
      <h1>Comments</h1>
      {loading && <p>Loading…</p>}
      {error && <p>{error}</p>}
      {!loading && !error && <CommentList comments={comments} />}
    </main>
  )
}

export default App
