/**
 * Trên Vercel: đọc VITE_API_URL và ghi vercel.json proxy /api → Render.
 * Trình duyệt chỉ gọi /api (cùng domain) — tránh 404 và lỗi CORS.
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
    source: '/api/:path*',
    destination: `${base}/api/:path*`,
  })
  console.log(`[prepare-vercel] /api/* → ${base}/api/*`)
} else if (process.env.VERCEL === '1') {
  console.error(`
❌ Thiếu VITE_API_URL trên Vercel.

Vercel → Settings → Environment Variables:
  Name:  VITE_API_URL
  Value: https://TEN-API.onrender.com/api

Rồi Deployments → Redeploy.
`)
  process.exit(1)
}

rewrites.push({ source: '/(.*)', destination: '/index.html' })
fs.writeFileSync(vercelPath, `${JSON.stringify({ rewrites }, null, 2)}\n`)
