/**
 * Local: /api (Vite proxy).
 * Vercel production: VITE_API_URL=https://xxx.onrender.com/api (gọi thẳng Render, tránh 405).
 */
const API = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

function explainHttpError(status, data, url) {
  if (data?.error) return data.error
  if (status === 405) {
    if (url.includes('vercel.app')) {
      return 'Lỗi 405: API chưa trỏ đúng Render. Đặt VITE_API_URL trên Vercel rồi Redeploy (build mới).'
    }
    return `Phương thức không hợp lệ (405): ${url}`
  }
  if (status === 404) {
    return `Không tìm thấy API (${url}). Kiểm tra VITE_API_URL có đuôi /api.`
  }
  if (status === 403) {
    return 'CORS: trên Render đặt ALLOW_VERCEL_PREVIEW=1 và CLIENT_ORIGIN=URL Vercel của bạn.'
  }
  if (status === 502 || status === 503) {
    return 'API đang khởi động (Render free). Đợi ~1 phút rồi thử lại.'
  }
  if (status === 500) {
    return 'Lỗi server khi lưu tin. Xem Logs trên Render.'
  }
  return `Lỗi máy chủ (${status}). Mở F12 → Network.`
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
    throw new Error(
      'Không kết nối API (mạng/CORS). Render: ALLOW_VERCEL_PREVIEW=1. Vercel: VITE_API_URL + Redeploy.',
    )
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
