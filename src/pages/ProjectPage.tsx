import { useEffect, useMemo, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { getProject } from '../lib/content'
import { formatDate } from '../lib/utils'
import { mdToHtml } from '../lib/markdown'
import type { Project } from '../types/content'
import { Seo } from '../components/Seo'
import { site } from '../site'
import { ParticleCTA } from '../components/ui/particle-cta'

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProject(slug ?? '').then((p) => {
      setProject(p)
      setLoading(false)
    })
  }, [slug])

  const bodyHtml = useMemo(() => (project ? mdToHtml(project.content) : ''), [project])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="skeleton h-8 mb-4 w-3/4"></div>
            <div className="skeleton h-4 mb-2 w-1/2"></div>
            <div className="skeleton h-4 mb-8 w-1/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return <Navigate to="/404" replace />
  }

  const title = `${project.title} — ${site.name}`
  const path = `/projects/${project.slug}`

  return (
    <div className="container mx-auto px-4 py-16">
      <Seo
        title={title}
        description={project.description}
        path={path}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          headline: project.title,
          description: project.description,
          datePublished: project.date,
          author: { '@type': 'Person', name: site.name },
          keywords: project.tags.join(', '),
        }}
      />
      <ParticleCTA className="rounded-2xl">
        <div className="py-4">
          <div className="max-w-4xl mx-auto">
            <nav className="mb-8" aria-label="Breadcrumb">
              <Link
                to="/projects"
                className="abyss-link inline-flex items-center"
              >
                ← Back to Projects
              </Link>
            </nav>

            <header className="mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">{project.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-abyss-400 mb-6">
                {project.date && <time dateTime={project.date}>{formatDate(project.date)}</time>}
                {project.featured && (
                  <>
                    <span aria-hidden="true">•</span>
                    <span className="badge badge-bitcoin">
                      Featured Project
                    </span>
                  </>
                )}
              </div>

              {project.description && (
                <p className="text-xl text-abyss-200 leading-relaxed mb-6">
                  {project.description}
                </p>
              )}

              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="text-sm font-medium text-abyss-400 mr-2">Technologies:</span>
                  {project.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="badge badge-bitcoin"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bitcoin-button inline-flex items-center font-medium"
                  >
                    View on GitHub
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="abyss-button inline-flex items-center font-medium"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </header>

            <article
              className="prose prose-lg prose-invert max-w-none text-abyss-100"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />

            <footer className="mt-16 pt-8 border-t border-abyss-700/30">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm text-abyss-400">
                  {project.date ? `Project completed on ${formatDate(project.date)}` : null}
                </div>
                <div className="flex gap-4">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="abyss-link text-sm"
                    >
                      View Source →
                    </a>
                  )}
                  <Link
                    to="/projects"
                    className="abyss-link text-sm"
                  >
                    View all projects →
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </ParticleCTA>
    </div>
  )
}