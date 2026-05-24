export function Label({ htmlFor, children, optional }) {
  return (
    <label htmlFor={htmlFor} className="field-label">
      {children}
      {optional && <span className="optional"> {optional}</span>}
    </label>
  )
}

export function Input({ className = '', ...props }) {
  return <input className={`field-input ${className}`} {...props} />
}

export function Textarea({ className = '', ...props }) {
  return <textarea className={`field-textarea ${className}`} {...props} />
}

export function Select({ className = '', children, ...props }) {
  return (
    <select className={`field-select ${className}`} {...props}>
      {children}
    </select>
  )
}

export function Hint({ children }) {
  return <p className="field-hint">{children}</p>
}
