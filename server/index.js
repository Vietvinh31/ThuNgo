const express = require('express')
const cors = require('cors')
const cron = require('node-cron')
const notesRouter = require('./routes/notes')
const db = require('./db')

const app = express()
const PORT = process.env.PORT || 3001

const clientOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
const allowVercelPreview = process.env.ALLOW_VERCEL_PREVIEW !== '0'

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true)
      if (clientOrigins.length === 0) return callback(null, true)
      if (clientOrigins.includes(origin)) return callback(null, true)
      if (allowVercelPreview && /^https:\/\/[\w.-]+\.vercel\.app$/i.test(origin)) {
        return callback(null, true)
      }
      callback(null, false)
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  }),
)
app.use(express.json({ limit: '2mb' }))
app.set('trust proxy', 1)

app.get('/', (_req, res) => {
  res.json({ ok: true, service: 'Thu Ngo API', health: '/api/health' })
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/notes', notesRouter)

app.use((err, _req, res, _next) => {
  if (err.message?.includes('CORS')) {
    return res.status(403).json({ error: 'CORS: domain Vercel chưa được phép. Đặt ALLOW_VERCEL_PREVIEW=1 hoặc CLIENT_ORIGIN đúng URL.' })
  }
  console.error(err)
  res.status(500).json({ error: 'Lỗi máy chủ nội bộ.' })
})

cron.schedule('*/15 * * * *', () => {
  const n = db.purgeExpired()
  if (n > 0) console.log(`Đã dọn ${n} tin hết hạn`)
})

app.listen(PORT, () => {
  console.log(`API chạy tại http://localhost:${PORT}`)
})
