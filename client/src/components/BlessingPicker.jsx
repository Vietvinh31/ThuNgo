import { useEffect, useState } from 'react'
import {
  BLESSING_CATEGORIES,
  categoryIdForTheme,
} from '../constants/blessingTemplates'

export default function BlessingPicker({ currentTheme, onSelect, onThemeSync }) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('love')
  const [pickedId, setPickedId] = useState(null)

  useEffect(() => {
    if (open) {
      setActiveTab(categoryIdForTheme(currentTheme))
      setPickedId(null)
    }
  }, [open, currentTheme])

  function handlePick(text, category) {
    setPickedId(text.slice(0, 24))
    onSelect(text)
    if (onThemeSync && category.themeId) {
      onThemeSync(category.themeId)
    }
    setTimeout(() => {
      setOpen(false)
      setPickedId(null)
    }, 280)
  }

  const active = BLESSING_CATEGORIES.find((c) => c.id === activeTab)

  return (
    <>
      <div className="mt-2">
        <button type="button" onClick={() => setOpen(true)} className="blessing-open-btn">
          <span className="blessing-open-btn__icon" aria-hidden>
            📜
          </span>
          Kho lời chúc có sẵn
        </button>
      </div>

      {open && (
        <div
          className="blessing-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="blessing-title"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="blessing-modal">
            <div className="blessing-modal__head">
              <div>
                <h2 id="blessing-title" className="blessing-modal__title">
                  Kho lời chúc có sẵn
                </h2>
              </div>
              <button
                type="button"
                className="blessing-modal__close"
                onClick={() => setOpen(false)}
                aria-label="Đóng"
              >
                ×
              </button>
            </div>

            <div className="blessing-tabs" role="tablist">
              {BLESSING_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === cat.id}
                  className={`blessing-tab ${activeTab === cat.id ? 'blessing-tab--active' : ''}`}
                  onClick={() => setActiveTab(cat.id)}
                >
                  <span aria-hidden>{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="blessing-list" role="tabpanel">
              {active?.items.map((text) => (
                <button
                  key={text}
                  type="button"
                  className={`blessing-snippet ${pickedId === text.slice(0, 24) ? 'blessing-snippet--picked' : ''}`}
                  onClick={() => handlePick(text, active)}
                >
                  <span className="blessing-snippet__text">{text}</span>
                  <span className="blessing-snippet__action" aria-hidden>
                    ✓ Chọn
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
