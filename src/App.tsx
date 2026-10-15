import { Component, Suspense, lazy, type ReactNode } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'

const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })))
const ProjectPage = lazy(() => import('./pages/ProjectPage').then((m) => ({ default: m.ProjectPage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })))
const BlogPage = lazy(() => import('./pages/BlogPage').then((m) => ({ default: m.BlogPage })))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage').then((m) => ({ default: m.BlogPostPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

// A failed page chunk (offline, stale deploy) or render error replaces only
// the page. The header stays usable. React.lazy caches the rejection, so
// recovery is a manual full reload, never an automatic retry loop.
class PageErrorBoundary extends Component<
  { pathname: string; children: ReactNode },
  { failed: boolean; pathname: string }
> {
  state = { failed: false, pathname: this.props.pathname }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  // Navigation to another route clears the error.
  static getDerivedStateFromProps(props: { pathname: string }, state: { pathname: string }) {
    return props.pathname === state.pathname ? null : { failed: false, pathname: props.pathname }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="container mx-auto px-4 py-16">
        <div role="alert" className="abyss-section max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">This page failed to load</h1>
          <p className="text-abyss-300 mb-6">
            Check your connection, then reload the page. The navigation above still works.
          </p>
          <button type="button" className="bitcoin-button font-medium" onClick={() => window.location.reload()}>
            Reload page
          </button>
        </div>
      </div>
    )
  }
}

function App() {
  const { pathname } = useLocation()
  return (
    <Layout>
      <PageErrorBoundary pathname={pathname}>
        <Suspense fallback={<div className="container mx-auto px-4 py-16"><div className="text-center"><div className="spinner mx-auto"></div></div></div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </PageErrorBoundary>
    </Layout>
  )
}

export default App
