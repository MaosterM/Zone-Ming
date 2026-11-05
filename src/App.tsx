import { BrowserRouter, Route, Routes } from 'react-router'
import Nav from './components/Nav'
import { useSmoothScroll } from './lib/smoothScroll'
import About from './pages/About'
import Contact from './pages/Contact'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProjectDetail from './pages/ProjectDetail'
import Work from './pages/Work'

export default function App() {
  useSmoothScroll()

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Nav />
      <main id="main" tabIndex={-1} className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
