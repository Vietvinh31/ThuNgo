import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { decryptMessage } from '../lib/crypto'
import { fetchNote, getNoteMeta, unlockNote } from '../lib/api'
import { getTheme } from '../constants/themes'
import { useAppTheme } from '../context/ThemeContext'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Field'

function RomanticCard({ children, className = '' }) {
  return (
    <div className={`glass-card rounded-3xl p-8 md:p-10 ${className}`}>
      {children}
    </div>
  )
}

export default function ViewPage() {
  const { noteId } = useParams()
  const { setThemeId } = useAppTheme()
  const keyFragment = window.location.hash.slice(1)

  const [phase, setPhase] = useState('loading')
  const [meta, setMeta] = useState(null)
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [destroyed, setDestroyed] = useState(false)
  const [countdown, setCountdown] = useState(null)

  useEffect(() => {
    let intervalId

    getNoteMeta(noteId)
      .then((m) => {
        setMeta(m)
        if (m.theme) setThemeId(m.theme)
        if (m.notYetActive && m.activateAt) {
          setPhase('scheduled')
          const target = new Date(m.activateAt)
          const tick = () => {
            const diff = target - Date.now()
            if (diff <= 0) {
              setPhase(m.hasPassword ? 'password' : 'ready')
              setCountdown(null)
              if (intervalId) clearInterval(intervalId)
            } else {
              setCountdown(Math.ceil(diff / 1000))
            }
          }
          tick()
          intervalId = setInterval(tick, 1000)
        } else {
          setPhase(m.hasPassword ? 'password' : 'ready')
        }
      })
      .catch((err) => {
        setError(err.message)
        setPhase('error')
      })

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [noteId, setThemeId])

  async function loadMessage(pwd) {
    setError('')
    try {
      if (meta?.hasPassword) {
        await unlockNote(noteId, pwd || password)
      }

      const data = await fetchNote(noteId)
      const plain = await decryptMessage(
        data.contentEncrypted,
        data.iv,
        data.salt,
        pwd || password,
        keyFragment || undefined,
      )
      setMessage(plain)
      setDestroyed(data.destroyed)
      setPhase('viewing')
    } catch (err) {
      if (err.status === 410) {
        setPhase('gone')
      } else if (err.status === 403) {
        setError(err.message)
      } else {
        setError(err.message || 'Không thể mở tin nhắn.')
      }
    }
  }

  function handlePasswordSubmit(e) {
    e.preventDefault()
    loadMessage(password)
  }

  function handleOpen() {
    if (meta?.hasPassword) return
    loadMessage()
  }

  const theme = getTheme(meta?.theme || 'love')

  if (phase === 'loading') {
    return (
      <div className="text-center py-20">
        <span className="loading-heart text-4xl text-rose-soft block mb-4">♥</span>
        <p className="text-mauve-light font-medium">Đang mở lá thư...</p>
      </div>
    )
  }

  if (phase === 'error' || phase === 'gone') {
    return (
      <div className="text-center py-16 max-w-sm mx-auto">
        <RomanticCard>
          <span className="text-5xl block mb-4 opacity-80" aria-hidden>
            {phase === 'gone' ? '🥀' : '💔'}
          </span>
          <h1 className="font-display text-2xl font-semibold text-rose-wine">
            {phase === 'gone'
              ? 'Lá thư đã tan'
              : 'Không tìm thấy lá thư'}
          </h1>
          <p className="mt-3 text-mauve-light text-sm leading-relaxed">
            {error || 'Có lẽ đã được đọc, hoặc thời gian đã trôi qua.'}
          </p>
          <Link
            to="/"
            className="btn-romantic btn-romantic--secondary inline-flex mt-8 no-underline"
          >
            Viết tin mới
          </Link>
        </RomanticCard>
      </div>
    )
  }

  if (phase === 'scheduled') {
    return (
      <RomanticCard className="text-center max-w-md mx-auto">
        <span className="text-5xl block mb-3" aria-hidden>
          {theme.emoji}
        </span>
        <h1 className="font-display text-2xl font-semibold text-rose-wine">
          Chưa đến giờ mở
        </h1>
        <p className="mt-2 text-mauve-light text-sm">
          Lá thư sẽ mở vào{' '}
          <strong className="text-rose-deep">
            {new Date(meta.activateAt).toLocaleString('vi-VN')}
          </strong>
        </p>
        {countdown != null && (
          <p className="mt-6 font-display text-3xl text-rose-deep tracking-wide">
            {Math.floor(countdown / 3600)}h {Math.floor((countdown % 3600) / 60)}m{' '}
            {countdown % 60}s
          </p>
        )}
      </RomanticCard>
    )
  }

  if (phase === 'password') {
    return (
      <div className="max-w-md mx-auto">
        <RomanticCard>
          <div className="text-center">
            <span className="text-5xl block mb-3" aria-hidden>
              🔐
            </span>
            <h1 className="font-display text-2xl font-semibold text-rose-wine">
              Có khóa bí mật
            </h1>
          </div>
          <form onSubmit={handlePasswordSubmit} className="mt-8 space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu..."
              autoFocus
            />
            {error && <div className="alert-soft alert-soft--error">{error}</div>}
            <Button type="submit">♥ Mở lá thư</Button>
          </form>
        </RomanticCard>
      </div>
    )
  }

  if (phase === 'ready') {
    return (
      <div className="max-w-md mx-auto">
        <RomanticCard className="text-center">
          <span className="text-6xl block mb-4 animate-[pulse-heart_2s_ease-in-out_infinite]" aria-hidden>
            {theme.emoji}
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-rose-wine leading-snug">
            Có lá thư dành cho bạn
          </h1>
          {error && <div className="alert-soft alert-soft--error mt-4">{error}</div>}
          <div className="mt-8">
            <Button type="button" onClick={handleOpen}>
              ♥ Mở lá thư
            </Button>
          </div>
        </RomanticCard>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-3xl overflow-hidden max-w-lg mx-auto">
      <div
        className="px-6 py-5 border-b flex items-center justify-center gap-2 bg-white/30"
        style={{ borderColor: 'var(--t-card-border)' }}
      >
        <span className="text-2xl" aria-hidden>
          {theme.emoji}
        </span>
        <span className="page-title font-display text-xl font-semibold">
          Dành riêng cho bạn
        </span>
        <span className="text-2xl" aria-hidden>
          {theme.emoji}
        </span>
      </div>

      <div className="px-6 py-8 md:px-10 md:py-10">
        <div className="message-reveal whitespace-pre-wrap text-center">
          {message}
        </div>
      </div>

      {destroyed ? (
        <div className="px-6 py-5 text-center border-t border-rose-200/30 bg-white/25">
          <p className="text-sm font-medium text-mauve-light italic">
            ♡ Lá thư đã tan — không còn lưu lại ♡
          </p>
        </div>
      ) : null}
    </div>
  )
}
