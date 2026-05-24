/** Luôn gọi /api — dev: Vite proxy; Vercel: rewrite sang Render (prepare-vercel.mjs) */
const API = '/api'

function explainHttpError(status, data, url) {
  if (data?.error) return data.error
  if (status === 404) {
    return `Không tìm thấy API (${url}). Trên Vercel: đặt VITE_API_URL = https://...onrender.com/api rồi Redeploy.`
  }
  if (status === 502 || status === 503) {
    return 'API đang khởi động (Render free). Đợi ~1 phút rồi thử lại.'
  }
  if (status === 500) {
    return 'Lỗi server khi lưu tin. Xem Logs trên Render.'
  }
  return `Lỗi máy chủ (${status}). Mở F12 → Network để xem chi tiết.`
}

async function request(path, options = {}) {
  const url = `${API}${path}`
  let res
  try {
    res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    })
  } catch {
    throw new Error('Không kết nối được API. Kiểm tra server local hoặc Render/Vercel.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(explainHttpError(res.status, data, url))
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
