import { BrowserRouter, Route, Routes } from 'react-router'
import Background from './components/Background'
import Nav from './components/Nav'
import PageTransition from './components/PageTransition'
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
      <Background />
      <Nav />
      <PageTransition>
        {(location) => (
          <main id="main" tabIndex={-1} className="relative z-10">
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/work" element={<Work />} />
              <Route path="/work/:slug" element={<ProjectDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        )}
      </PageTransition>
    </BrowserRouter>
  )
}
