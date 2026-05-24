import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { encryptMessage } from '../lib/crypto'
import { createNote } from '../lib/api'
import { useAppTheme } from '../context/ThemeContext'
import { THEMES, EXPIRE_OPTIONS } from '../constants/themes'
import PageHeader from '../components/PageHeader'
import ThemeChip from '../components/ThemeChip'
import BlessingPicker from '../components/BlessingPicker'
import Button from '../components/ui/Button'
import { Label, Input, Textarea, Select } from '../components/ui/Field'

export default function CreatePage() {
  const navigate = useNavigate()
  const { themeId, setThemeId } = useAppTheme()
  const [content, setContent] = useState('')
  const [maxViews, setMaxViews] = useState(1)
  const [expireMode, setExpireMode] = useState('datetime')
  const [expireHours, setExpireHours] = useState(24)
  const [expireAt, setExpireAt] = useState('')
  const [password, setPassword] = useState('')
  const [scheduleEnabled, setScheduleEnabled] = useState(false)
  const [activateAt, setActivateAt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!content.trim()) {
      setError('Hãy viết vài dòng từ trái tim — tin nhắn đang chờ bạn.')
      return
    }

    if (expireMode === 'datetime') {
      if (!expireAt) {
        setError('Hãy chọn ngày giờ tin sẽ tự tan.')
        return
      }
      if (new Date(expireAt) <= new Date()) {
        setError('Thời điểm tự tan phải ở tương lai.')
        return
      }
    }

    setLoading(true)
    try {
      const encrypted = await encryptMessage(content.trim(), password)
      const body = {
        contentEncrypted: encrypted.contentEncrypted,
        iv: encrypted.iv,
        salt: encrypted.salt,
        theme: themeId,
        expireAfterReadHours: expireMode === 'after_read' ? expireHours : null,
        expireAt: expireMode === 'datetime' ? new Date(expireAt).toISOString() : null,
        maxViews: Number(maxViews),
        activateAt: scheduleEnabled && activateAt ? new Date(activateAt).toISOString() : null,
        password: password.trim() || undefined,
      }

      const { noteId } = await createNote(body)
      const keyPart = encrypted.keyFragment ? `#${encrypted.keyFragment}` : ''
      navigate(`/share/${noteId}${keyPart}`, {
        state: {
          hasPassword: !!password.trim(),
          maxViews,
          expireMode,
          expireHours,
          expireAt: expireMode === 'datetime' ? expireAt : null,
          scheduleEnabled,
          activateAt,
          theme: themeId,
        },
      })
    } catch (err) {
      setError(err.message || 'Không thể tạo tin nhắn. Thử lại nhé.')
    } finally {
      setLoading(false)
    }
  }

  const defaultExpireLocal = () => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    d.setMinutes(0, 0, 0)
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`
  }

  return (
    <div>
      <PageHeader icon="💕" title="Viết lời yêu thương" />

      <form
        onSubmit={handleSubmit}
        className="glass-card rounded-3xl p-6 md:p-8 space-y-7"
      >
        <div>
          <Label htmlFor="content">Lời nhắn từ trái tim</Label>
          <Textarea
            id="content"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Anh yêu em... / Chúc em sinh nhật thật vui..."
          />
          <BlessingPicker
            currentTheme={themeId}
            onSelect={(text) => setContent(text)}
            onThemeSync={setThemeId}
          />
        </div>

        <div>
          <Label>Chọn không khí</Label>
          <div className="theme-chips-grid">
            {THEMES.map((t) => (
              <ThemeChip
                key={t.id}
                themeId={t.id}
                active={themeId === t.id}
                onClick={() => setThemeId(t.id)}
              />
            ))}
          </div>
        </div>

        <div className="section-divider" />

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="maxViews">Số lần được đọc</Label>
            <Input
              id="maxViews"
              type="number"
              min={1}
              max={10}
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
            />
          </div>

          <div>
            <Label>Tự tan</Label>
            <div className="expire-tabs">
              <button
                type="button"
                className={`expire-tab ${expireMode === 'datetime' ? 'expire-tab--active' : ''}`}
                onClick={() => {
                  setExpireMode('datetime')
                  if (!expireAt) setExpireAt(defaultExpireLocal())
                }}
              >
                Đúng ngày giờ
              </button>
              <button
                type="button"
                className={`expire-tab ${expireMode === 'after_read' ? 'expire-tab--active' : ''}`}
                onClick={() => setExpireMode('after_read')}
              >
                Sau lần đọc
              </button>
            </div>
            {expireMode === 'datetime' ? (
              <Input
                type="datetime-local"
                value={expireAt}
                onChange={(e) => setExpireAt(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            ) : (
              <Select
                value={expireHours}
                onChange={(e) => setExpireHours(Number(e.target.value))}
              >
                {EXPIRE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="password" optional="(tuỳ chọn)">
            Khóa bí mật
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
          />
        </div>

        <div className="toggle-panel">
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={scheduleEnabled}
              onChange={(e) => setScheduleEnabled(e.target.checked)}
            />
            <span>Hẹn giờ gửi</span>
          </label>
          {scheduleEnabled && (
            <Input
              type="datetime-local"
              value={activateAt}
              onChange={(e) => setActivateAt(e.target.value)}
              className="mt-4"
              min={new Date().toISOString().slice(0, 16)}
            />
          )}
        </div>

        {error && <div className="alert-soft alert-soft--error">{error}</div>}

        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-heart">♥</span>
              Đang gói yêu thương...
            </>
          ) : (
            <>♥ Gửi tin nhắn bí mật</>
          )}
        </Button>
      </form>
    </div>
  )
}
