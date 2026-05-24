const API = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || 'Lỗi máy chủ')
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export function createNote(body) {
  return request('/notes', { method: 'POST', body: JSON.stringify(body) })
}

export function getNoteMeta(noteId) {
  return request(`/notes/${noteId}/meta`)
}

export function unlockNote(noteId, password) {
  return request(`/notes/${noteId}/unlock`, {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
}

export function fetchNote(noteId) {
  return request(`/notes/${noteId}`)
}

export function deleteNote(noteId) {
  return request(`/notes/${noteId}`, { method: 'DELETE' })
}
