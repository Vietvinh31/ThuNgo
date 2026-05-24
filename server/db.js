const Database = require('better-sqlite3')
const path = require('path')

const db = new Database(path.join(__dirname, 'data.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    noteId TEXT PRIMARY KEY,
    contentEncrypted TEXT NOT NULL,
    iv TEXT NOT NULL,
    salt TEXT,
    theme TEXT DEFAULT 'default',
    expireAfterReadHours INTEGER,
    expireAt TEXT,
    maxViews INTEGER DEFAULT 1,
    viewCount INTEGER DEFAULT 0,
    activateAt TEXT,
    passwordHash TEXT,
    hasPassword INTEGER DEFAULT 0,
    isDeleted INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT (datetime('now')),
    firstViewedAt TEXT
  )
`)

try {
  db.exec(`ALTER TABLE notes ADD COLUMN expireAt TEXT`)
} catch {
  /* column exists */
}

const stmts = {
  insert: db.prepare(`
    INSERT INTO notes (
      noteId, contentEncrypted, iv, salt, theme,
      expireAfterReadHours, expireAt, maxViews, activateAt, passwordHash, hasPassword
    ) VALUES (
      @noteId, @contentEncrypted, @iv, @salt, @theme,
      @expireAfterReadHours, @expireAt, @maxViews, @activateAt, @passwordHash, @hasPassword
    )
  `),
  getById: db.prepare(`SELECT * FROM notes WHERE noteId = ? AND isDeleted = 0`),
  markViewed: db.prepare(`
    UPDATE notes SET viewCount = viewCount + 1, firstViewedAt = COALESCE(firstViewedAt, datetime('now'))
    WHERE noteId = ?
  `),
  deleteNote: db.prepare(`UPDATE notes SET isDeleted = 1 WHERE noteId = ?`),
  expiredAfterRead: db.prepare(`
    SELECT noteId FROM notes
    WHERE isDeleted = 0
      AND firstViewedAt IS NOT NULL
      AND expireAfterReadHours IS NOT NULL
      AND datetime(firstViewedAt, '+' || expireAfterReadHours || ' hours') < datetime('now')
  `),
  expiredAbsolute: db.prepare(`
    SELECT noteId FROM notes
    WHERE isDeleted = 0
      AND expireAt IS NOT NULL
      AND datetime(expireAt) < datetime('now')
  `),
}

function createNote(data) {
  stmts.insert.run(data)
  return data.noteId
}

function getNote(noteId) {
  return stmts.getById.get(noteId)
}

function incrementView(noteId) {
  stmts.markViewed.run(noteId)
}

function softDelete(noteId) {
  stmts.deleteNote.run(noteId)
}

function purgeExpired() {
  const rows = [...stmts.expiredAfterRead.all(), ...stmts.expiredAbsolute.all()]
  const seen = new Set()
  for (const { noteId } of rows) {
    if (!seen.has(noteId)) {
      seen.add(noteId)
      softDelete(noteId)
    }
  }
  return seen.size
}

function isNoteExpired(note) {
  const now = new Date()
  if (note.expireAt) {
    const exp = new Date(note.expireAt)
    if (now > exp) return true
  }
  if (note.firstViewedAt && note.expireAfterReadHours) {
    const first = new Date(note.firstViewedAt.includes('T') ? note.firstViewedAt : note.firstViewedAt + 'Z')
    const expires = new Date(first.getTime() + note.expireAfterReadHours * 3600_000)
    if (now > expires) return true
  }
  return false
}

module.exports = { createNote, getNote, incrementView, softDelete, purgeExpired, isNoteExpired }
