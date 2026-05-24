import { createContext, useContext, useMemo, useState } from 'react'

const ThemeContext = createContext({
  themeId: 'love',
  setThemeId: () => {},
})

export function ThemeProvider({ children, initialTheme = 'love' }) {
  const [themeId, setThemeId] = useState(initialTheme)

  const value = useMemo(
    () => ({ themeId, setThemeId }),
    [themeId],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useAppTheme() {
  return useContext(ThemeContext)
}
