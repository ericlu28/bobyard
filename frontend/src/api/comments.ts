import type { Comment, CommentRequest } from '../types'

const API_URL = '/api/comments'

// Throw on non-2xx responses
async function parse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

// GET /api/comments
export async function getComments(): Promise<Comment[]> {
  const res = await fetch(API_URL)
  return parse<Comment[]>(res)
}

// POST /api/comments
export async function addComment(text: string, image = ''): Promise<Comment> {
  const body: CommentRequest = {text, image}
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  })
  return parse<Comment>(response)
}

// PUT /api/comments/{id}
export async function editComment(id: number, text: string): Promise<Comment> {
  const body: CommentRequest = { text }
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return parse<Comment>(res)
}

// DELETE /api/comments/{id}
export async function deleteComment(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
     method: 'DELETE' 
  })
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`)
  }
}
