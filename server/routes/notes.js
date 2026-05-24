const express = require('express')
const bcrypt = require('bcryptjs')
const { customAlphabet } = require('nanoid')
const db = require('../db')

const router = express.Router()
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 10)

const rateMap = new Map()
const RATE_LIMIT = 30
const RATE_WINDOW_MS = 60_000

function rateLimit(ip) {
  const now = Date.now()
  let entry = rateMap.get(ip)
  if (!entry || now - entry.start > RATE_WINDOW_MS) {
    entry = { start: now, count: 0 }
    rateMap.set(ip, entry)
  }
  entry.count += 1
  return entry.count <= RATE_LIMIT
}

router.post('/', async (req, res) => {
  const ip = req.ip || req.socket.remoteAddress
  if (!rateLimit(ip)) {
    return res.status(429).json({ error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.' })
  }

  const {
    contentEncrypted,
    iv,
    salt,
    theme = 'default',
    expireAfterReadHours,
    expireAt,
    maxViews = 1,
    activateAt,
    password,
  } = req.body

  if (!contentEncrypted || !iv) {
    return res.status(400).json({ error: 'Thiếu dữ liệu mã hóa.' })
  }

  if (expireAt && new Date(expireAt) <= new Date()) {
    return res.status(400).json({ error: 'Thời điểm tự tan phải ở tương lai.' })
  }

  const noteId = nanoid()
  let passwordHash = null
  let hasPassword = 0

  if (password && password.trim()) {
    passwordHash = await bcrypt.hash(password.trim(), 10)
    hasPassword = 1
  }

  db.createNote({
    noteId,
    contentEncrypted,
    iv,
    salt: salt || null,
    theme,
    expireAfterReadHours: expireAt ? null : (expireAfterReadHours ?? null),
    expireAt: expireAt || null,
    maxViews: Math.max(1, Math.min(10, Number(maxViews) || 1)),
    activateAt: activateAt || null,
    passwordHash,
    hasPassword,
  })

  res.status(201).json({ noteId })
})

router.get('/:noteId/meta', (req, res) => {
  const note = db.getNote(req.params.noteId)
  if (!note) {
    return res.status(404).json({ error: 'Tin nhắn không tồn tại hoặc đã bị hủy.' })
  }

  if (db.isNoteExpired(note)) {
    db.softDelete(note.noteId)
    return res.status(410).json({ error: 'Tin nhắn đã hết hạn.' })
  }

  const now = new Date()
  const activateAt = note.activateAt ? new Date(note.activateAt) : null
  const notYetActive = activateAt && activateAt > now

  res.json({
    noteId: note.noteId,
    theme: note.theme,
    hasPassword: !!note.hasPassword,
    maxViews: note.maxViews,
    viewCount: note.viewCount,
    activateAt: note.activateAt,
    notYetActive,
    expireAfterReadHours: note.expireAfterReadHours,
    expireAt: note.expireAt,
  })
})

router.post('/:noteId/unlock', async (req, res) => {
  const note = db.getNote(req.params.noteId)
  if (!note) {
    return res.status(404).json({ error: 'Tin nhắn không tồn tại hoặc đã bị hủy.' })
  }

  if (note.hasPassword) {
    const { password } = req.body
    if (!password) {
      return res.status(400).json({ error: 'Vui lòng nhập mật khẩu.' })
    }
    const ok = await bcrypt.compare(password, note.passwordHash)
    if (!ok) {
      return res.status(403).json({ error: 'Mật khẩu không đúng.' })
    }
  }

  res.json({ ok: true })
})

router.get('/:noteId', (req, res) => {
  const note = db.getNote(req.params.noteId)
  if (!note) {
    return res.status(404).json({ error: 'Tin nhắn không tồn tại hoặc đã bị hủy.' })
  }

  if (db.isNoteExpired(note)) {
    db.softDelete(note.noteId)
    return res.status(410).json({ error: 'Tin nhắn đã hết hạn.' })
  }

  const now = new Date()
  if (note.activateAt) {
    const activateAt = new Date(note.activateAt)
    if (activateAt > now) {
      return res.status(403).json({
        error: 'Tin nhắn chưa đến thời gian mở.',
        activateAt: note.activateAt,
      })
    }
  }

  if (note.viewCount >= note.maxViews) {
    return res.status(410).json({ error: 'Tin nhắn đã hết lượt xem hoặc đã bị hủy.' })
  }

  if (db.isNoteExpired(note)) {
    db.softDelete(note.noteId)
    return res.status(410).json({ error: 'Tin nhắn đã hết hạn.' })
  }

  db.incrementView(note.noteId)
  const updated = db.getNote(req.params.noteId)

  if (updated.viewCount >= updated.maxViews) {
    db.softDelete(note.noteId)
  }

  res.json({
    contentEncrypted: note.contentEncrypted,
    iv: note.iv,
    salt: note.salt,
    theme: note.theme,
    hasPassword: !!note.hasPassword,
    viewsRemaining: Math.max(0, note.maxViews - updated.viewCount),
    destroyed: updated.viewCount >= updated.maxViews,
  })
})

router.delete('/:noteId', (req, res) => {
  const note = db.getNote(req.params.noteId)
  if (!note) {
    return res.status(404).json({ error: 'Không tìm thấy tin nhắn.' })
  }
  db.softDelete(req.params.noteId)
  res.json({ ok: true })
})

module.exports = router
