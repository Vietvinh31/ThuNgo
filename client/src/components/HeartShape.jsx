/** Các kiểu trái tim khác nhau cho nền động */
export default function HeartShape({ variant, size = 20 }) {
  const s = size
  const fill = 'currentColor'

  switch (variant) {
    case 'classic':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
          <path
            fill={fill}
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      )
    case 'round':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
          <path
            fill={fill}
            d="M12 20.5c-4.5-3.8-7.5-6.5-7.5-10a4.5 4.5 0 0 1 8.2-2.6A4.5 4.5 0 0 1 19.5 10.5c0 3.5-3 6.2-7.5 10z"
          />
        </svg>
      )
    case 'outline':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="none"
            stroke={fill}
            strokeWidth="1.8"
            d="M12 20.5c-4.5-3.8-7.5-6.5-7.5-10a4.5 4.5 0 0 1 8.2-2.6A4.5 4.5 0 0 1 19.5 10.5c0 3.5-3 6.2-7.5 10z"
          />
        </svg>
      )
    case 'double':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
          <path
            fill={fill}
            opacity="0.9"
            d="M12 20.5c-4.5-3.8-7.5-6.5-7.5-10a4.5 4.5 0 0 1 8.2-2.6A4.5 4.5 0 0 1 19.5 10.5c0 3.5-3 6.2-7.5 10z"
          />
          <circle cx="8" cy="9" r="1.2" fill={fill} opacity="0.5" />
          <circle cx="16" cy="8" r="0.9" fill={fill} opacity="0.5" />
        </svg>
      )
    case 'tilt':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
          <path
            fill={fill}
            transform="rotate(-18 12 12)"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      )
    case 'split':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
          <path fill={fill} d="M12 20c-3-2.5-5-4.5-5-7a3.5 3.5 0 0 1 6.5-2 3.5 3.5 0 0 1 6.5 2c0 2.5-2 4.5-5 7z" />
          <path fill="none" stroke={fill} strokeWidth="1.2" d="M12 6v14" opacity="0.4" />
        </svg>
      )
    case 'wide':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
          <path
            fill={fill}
            d="M12 18.5c-5-4.2-8-7-8-10.5C4 5.5 6.5 3 9.5 3c2 0 3.5 1 2.5 2.5 1-1.5 2.5-2.5 4.5-2.5 3 0 5.5 2.5 5.5 5.5 0 3.5-3 6.3-8 10.5z"
          />
        </svg>
      )
    case 'ring':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="none"
            stroke={fill}
            strokeWidth="1.5"
            d="M12 20.5c-4.5-3.8-7.5-6.5-7.5-10a4.5 4.5 0 0 1 8.2-2.6A4.5 4.5 0 0 1 19.5 10.5c0 3.5-3 6.2-7.5 10z"
          />
          <circle cx="12" cy="11" r="2" fill={fill} opacity="0.6" />
        </svg>
      )
    case 'mini-pair':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
          <path fill={fill} opacity="0.8" transform="scale(0.55) translate(2,4)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          <path fill={fill} opacity="0.55" transform="scale(0.45) translate(18,8)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      )
    case 'soft':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
          <ellipse cx="12" cy="13" rx="7" ry="6" fill={fill} opacity="0.35" />
          <path fill={fill} d="M12 20.5c-4.5-3.8-7.5-6.5-7.5-10a4.5 4.5 0 0 1 8.2-2.6A4.5 4.5 0 0 1 19.5 10.5c0 3.5-3 6.2-7.5 10z" />
        </svg>
      )
    default:
      return (
        <span className="heart-emoji" style={{ fontSize: s }}>
          {variant}
        </span>
      )
  }
}
