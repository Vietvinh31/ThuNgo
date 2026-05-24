/**
 * Trên Vercel: ghi vercel.json — proxy /api → Render (dự phòng).
 * Trình duyệt ưu tiên VITE_API_URL (gọi thẳng Render) để tránh 405 POST vào index.html.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const vercelPath = path.join(root, 'vercel.json')

const raw = (process.env.VITE_API_URL || process.env.RENDER_API_URL || '').trim()
const rewrites = []

if (raw) {
  const base = raw.replace(/\/+$/, '').replace(/\/api$/i, '')
  rewrites.push({
    source: '/api/(.*)',
    destination: `${base}/api/$1`,
  })
  // Không rewrite /api/* về index.html (tránh 405 Method Not Allowed khi POST)
  rewrites.push({
    source: '/((?!api/).*)',
    destination: '/index.html',
  })
  console.log(`[prepare-vercel] proxy /api/* → ${base}/api/*`)
  console.log(`[prepare-vercel] VITE_API_URL sẽ gắn vào bundle — gọi thẳng Render (khuyên dùng)`)
} else if (process.env.VERCEL === '1') {
  console.error(`
❌ Thiếu VITE_API_URL trên Vercel.

Settings → Environment Variables:
  VITE_API_URL = https://TEN-API.onrender.com/api

Rồi Redeploy (build mới).
`)
  process.exit(1)
} else {
  rewrites.push({ source: '/(.*)', destination: '/index.html' })
}

fs.writeFileSync(vercelPath, `${JSON.stringify({ rewrites }, null, 2)}\n`)
