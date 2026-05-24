import { getTheme } from '../constants/themes'

export default function ThemeChip({ themeId, active, onClick }) {
  const t = getTheme(themeId)
  return (
    <button
      type="button"
      onClick={onClick}
      className={`theme-chip ${t.chip} ${active ? t.chipActive : ''}`}
      aria-pressed={active}
    >
      <span className="theme-chip__emoji" aria-hidden>
        {t.emoji}
      </span>
      <span className="theme-chip__label">{t.label}</span>
    </button>
  )
}
