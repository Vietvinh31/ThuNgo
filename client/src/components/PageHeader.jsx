export default function PageHeader({ title, subtitle, icon = '♥' }) {
  return (
    <header className="text-center mb-10">
      <p className="page-icon text-lg mb-2 tracking-widest" aria-hidden>
        {icon}
      </p>
      <h1 className="page-title font-display text-4xl md:text-[2.75rem] font-semibold leading-tight tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="page-subtitle mt-3 text-base md:text-lg max-w-md mx-auto leading-relaxed font-medium">
          {subtitle}
        </p>
      )}
    </header>
  )
}
