import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import CreatePage from './pages/CreatePage'
import SharePage from './pages/SharePage'
import ViewPage from './pages/ViewPage'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider initialTheme="love">
        <Layout>
          <Routes>
            <Route path="/" element={<CreatePage />} />
            <Route path="/share/:noteId" element={<SharePage />} />
            <Route path="/n/:noteId" element={<ViewPage />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
