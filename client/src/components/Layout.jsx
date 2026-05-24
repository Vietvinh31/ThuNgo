import { Link, useLocation } from 'react-router-dom'
import { useAppTheme } from '../context/ThemeContext'
import DecorativeBackground from './DecorativeBackground'

export default function Layout({ children }) {
  const { pathname } = useLocation()
  const { themeId } = useAppTheme()
  const isHome = pathname === '/'

  return (
    <div className="romantic-bg flex flex-col min-h-svh" data-theme={themeId}>
      <DecorativeBackground />

      <header className="site-header">
        <div className="max-w-xl mx-auto px-5 h-[4.25rem] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 no-underline group shrink-0">
            <span
              className="brand-logo flex items-center justify-center w-10 h-10 rounded-full text-lg transition-transform duration-300 group-hover:scale-105"
              aria-hidden
            >
              ♥
            </span>
            <div className="text-left min-w-0">
              <span className="brand-title font-display text-xl font-semibold block leading-tight transition-colors truncate">
                Thư Ngỏ
              </span>
              <span className="brand-tagline text-[0.65rem] font-semibold tracking-[0.18em] uppercase block truncate">
                gửi yêu thương
              </span>
            </div>
          </Link>

          {!isHome && (
            <Link
              to="/"
              className="btn-romantic btn-romantic--secondary no-underline text-sm py-2 px-3.5 shrink-0 ml-2"
            >
              ✦ Tạo mới
            </Link>
          )}
        </div>
      </header>

      <main className="site-main">{children}</main>

      <footer className="web-footer">
        <p className="web-footer__credit">
          Made with <span className="web-footer__heart" aria-hidden>💖</span> by{' '}
          <span className="author-name">VietVinh</span>
        </p>
        <p className="copyright">© 2026 ThuNgo. All rights reserved.</p>
      </footer>
    </div>
  )
}
