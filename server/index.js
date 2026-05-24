const express = require('express')
const cors = require('cors')
const cron = require('node-cron')
const notesRouter = require('./routes/notes')
const db = require('./db')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.set('trust proxy', 1)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/notes', notesRouter)

cron.schedule('*/15 * * * *', () => {
  const n = db.purgeExpired()
  if (n > 0) console.log(`Đã dọn ${n} tin hết hạn`)
})

app.listen(PORT, () => {
  console.log(`API chạy tại http://localhost:${PORT}`)
})
