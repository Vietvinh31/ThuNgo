import { useMemo } from 'react'
import { useAppTheme } from '../context/ThemeContext'
import HeartShape from './HeartShape'

const EMOJI_HEARTS = [
  '♥',
  '♡',
  '❤',
  '💕',
  '💗',
  '💖',
  '🩷',
  '❣',
  '💓',
  '💞',
  '💘',
  '💝',
  '🫶',
  '❤️‍🔥',
  '💜',
  '🩵',
  '♥️',
  '💟',
  '🤍',
  '🩶',
]

const SVG_VARIANTS = [
  'classic',
  'round',
  'outline',
  'double',
  'tilt',
  'split',
  'wide',
  'ring',
  'mini-pair',
  'soft',
]

const ANIM_STYLES = ['rise', 'rise-fast', 'rise-slow', 'zigzag', 'sway']

const HEART_COUNT = 72

function buildFloatingHearts(themeId, count = HEART_COUNT) {
  const pool = [
    ...SVG_VARIANTS.map((v) => ({ type: 'svg', variant: v })),
    ...EMOJI_HEARTS.map((v) => ({ type: 'emoji', variant: v })),
  ]

  const items = []
  let seed = themeId.split('').reduce((a, c) => a + c.charCodeAt(0), 0) + count

  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }

  for (let i = 0; i < count; i++) {
    const kind = pool[Math.floor(rand() * pool.length)]

    items.push({
      id: `${themeId}-${i}`,
      kind,
      left: rand() * 100,
      sizePx: 10 + rand() * 28,
      duration: 8 + rand() * 20,
      delay: -rand() * 35,
      drift: (rand() - 0.5) * 120,
      sway: 15 + rand() * 45,
      rotate: (rand() - 0.5) * 1080,
      opacity: 0.1 + rand() * 0.28,
      blur: rand() > 0.82 ? 0.8 : 0,
      anim: ANIM_STYLES[i % ANIM_STYLES.length],
      alt: rand() > 0.55,
      startY: rand() * 15,
    })
  }

  return items
}

export default function DecorativeBackground() {
  const { themeId } = useAppTheme()
  const hearts = useMemo(() => buildFloatingHearts(themeId), [themeId])

  return (
    <div className="hearts-float" aria-hidden="true">
      {hearts.map((h) => (
        <div
          key={h.id}
          className={`floating-heart floating-heart--${h.anim}${h.alt ? ' floating-heart--alt' : ''}`}
          style={{
            '--heart-left': `${h.left}%`,
            '--heart-size': `${h.sizePx}px`,
            '--heart-duration': `${h.duration}s`,
            '--heart-delay': `${h.delay}s`,
            '--heart-drift': `${h.drift}px`,
            '--heart-sway': `${h.sway}px`,
            '--heart-rotate': `${h.rotate}deg`,
            '--heart-opacity': h.opacity,
            '--heart-blur': `${h.blur}px`,
            '--heart-start': `${h.startY}%`,
          }}
        >
          <HeartShape variant={h.kind.variant} size={h.sizePx} />
        </div>
      ))}
    </div>
  )
}
