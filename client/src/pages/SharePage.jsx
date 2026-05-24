import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import QRCode from 'qrcode'
import { useAppTheme } from '../context/ThemeContext'
import PageHeader from '../components/PageHeader'
import { SocialButton } from '../components/ui/Button'

export default function SharePage() {
  const { noteId } = useParams()
  const location = useLocation()
  const { setThemeId } = useAppTheme()
  const state = location.state || {}

  useEffect(() => {
    if (state.theme) setThemeId(state.theme)
  }, [state.theme, setThemeId])
  const [qrUrl, setQrUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const shareUrl = `${window.location.origin}/n/${noteId}${location.hash}`

  useEffect(() => {
    QRCode.toDataURL(shareUrl, {
      width: 200,
      margin: 2,
      color: { dark: '#9d174d', light: '#fff8f9' },
    }).then(setQrUrl)
  }, [shareUrl])

  function copyLink() {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  function downloadQr() {
    const a = document.createElement('a')
    a.href = qrUrl
    a.download = `thu-ngo-${noteId}.png`
    a.click()
  }

  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  const messengerShare = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}&redirect_uri=${encodeURIComponent(shareUrl)}&display=popup`

  return (
    <div className="text-center">
      <div className="success-badge mb-6">♥</div>

      <PageHeader icon="✨" title="Đã gói xong!" />

      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 text-left max-w-md mx-auto">
        <div>
          <p className="field-label text-center">Link yêu thương</p>
          <div className="flex gap-2.5 items-stretch">
            <input readOnly value={shareUrl} className="link-box" aria-label="Link chia sẻ" />
            <button
              type="button"
              onClick={copyLink}
              className="btn-romantic btn-romantic--secondary shrink-0 px-5"
            >
              {copied ? '♥ Đã chép' : 'Sao chép'}
            </button>
          </div>
        </div>

        {qrUrl && (
          <>
            <div className="section-divider" />
            <div className="text-center">
              <p className="field-label">Mã QR</p>
              <div className="qr-frame mx-auto">
                <img
                  src={qrUrl}
                  alt="Mã QR mở tin nhắn"
                  className="rounded-xl block"
                  width={200}
                  height={200}
                />
              </div>
              <button
                type="button"
                onClick={downloadQr}
                className="btn-romantic btn-romantic--ghost mt-4 mx-auto"
              >
                ↓ Tải mã QR
              </button>
            </div>
          </>
        )}

        <div className="section-divider" />

        <div>
          <p className="field-label text-center mb-3">Chia sẻ qua</p>
          <div className="flex flex-wrap justify-center gap-3">
            <SocialButton href={facebookShare} className="btn-social--facebook">
              Facebook
            </SocialButton>
            <SocialButton href={messengerShare} className="btn-social--messenger">
              Messenger
            </SocialButton>
          </div>
        </div>
      </div>

      <Link
        to="/"
        className="link-back inline-flex items-center gap-1.5 mt-8 font-semibold text-sm no-underline transition-colors"
      >
        <span aria-hidden>←</span> Viết tin nhắn khác
      </Link>
    </div>
  )
}
