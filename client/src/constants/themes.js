export const THEMES = [
  {
    id: 'default',
    label: 'Lời thư',
    emoji: '💌',
    bg: 'from-rose-50/90 via-blush-100/80 to-pink-50/90',
    accent: 'text-rose-wine',
    card: 'glass-card',
    chip: 'theme-chip--letter',
    chipActive: 'theme-chip--letter-active',
  },
  {
    id: 'birthday',
    label: 'Sinh nhật',
    emoji: '🎂',
    bg: 'from-pink-50/90 via-amber-50/70 to-orange-50/80',
    accent: 'text-rose-wine',
    card: 'glass-card',
    chip: 'theme-chip--birthday',
    chipActive: 'theme-chip--birthday-active',
  },
  {
    id: 'love',
    label: 'Tình yêu',
    emoji: '💕',
    bg: 'from-rose-100/80 via-pink-50/90 to-red-50/70',
    accent: 'text-rose-deep',
    card: 'glass-card',
    chip: 'theme-chip--love',
    chipActive: 'theme-chip--love-active',
  },
  {
    id: 'christmas',
    label: 'Giáng sinh',
    emoji: '🎄',
    bg: 'from-emerald-50/70 via-rose-50/80 to-red-50/60',
    accent: 'text-rose-wine',
    card: 'glass-card',
    chip: 'theme-chip--christmas',
    chipActive: 'theme-chip--christmas-active',
  },
  {
    id: 'thanks',
    label: 'Chúc mừng',
    emoji: '🌸',
    bg: 'from-amber-50/70 via-rose-50/80 to-pink-50/80',
    accent: 'text-rose-wine',
    card: 'glass-card',
    chip: 'theme-chip--thanks',
    chipActive: 'theme-chip--thanks-active',
  },
  {
    id: 'condolence',
    label: 'An ủi',
    emoji: '🕊️',
    bg: 'from-violet-50/60 via-rose-50/70 to-blush-100/80',
    accent: 'text-mauve',
    card: 'glass-card',
    chip: 'theme-chip--comfort',
    chipActive: 'theme-chip--comfort-active',
  },
]

export function getTheme(id) {
  return THEMES.find((t) => t.id === id) || THEMES[0]
}

export const EXPIRE_OPTIONS = [
  { value: 1, label: '1 giờ sau lần đọc' },
  { value: 24, label: '24 giờ sau lần đọc' },
  { value: 168, label: '7 ngày sau lần đọc' },
  { value: 720, label: '30 ngày sau lần đọc' },
]
