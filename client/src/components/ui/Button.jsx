export default function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  const variants = {
    primary: 'btn-romantic btn-romantic--primary',
    secondary: 'btn-romantic btn-romantic--secondary',
    ghost: 'btn-romantic btn-romantic--ghost',
  }

  return (
    <button
      type={type}
      className={`${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function SocialButton({ href, children, className = '', ...props }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`btn-romantic btn-romantic--social ${className}`}
      {...props}
    >
      {children}
    </a>
  )
}
