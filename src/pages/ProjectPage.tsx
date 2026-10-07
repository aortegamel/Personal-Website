import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { getProject } from '../lib/content'
import { formatDate } from '../lib/utils'
import type { Project } from '../types/content'

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4 w-3/4"></div>
            <div className="h-4 bg-muted rounded mb-2 w-1/2"></div>
            <div className="h-4 bg-muted rounded mb-8 w-1/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return <Navigate to="/404" replace />
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-8">
          <Link
            to="/projects"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            ← Back to Projects
          </Link>
        </nav>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{project.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
            <time dateTime={project.date}>{formatDate(project.date)}</time>
            {project.featured && (
              <>
                <span>•</span>
                <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium">
                  Featured Project
                </span>
              </>
            )}
          </div>

          {project.description && (
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              {project.description}
            </p>
          )}

          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="text-sm font-medium text-muted-foreground mr-2">Technologies:</span>
              {project.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-muted px-3 py-1 rounded-full text-sm text-muted-foreground"
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
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
              >
                View on GitHub
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-input bg-background rounded-md hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
              >
                Live Demo
              </a>
            )}
          </div>
        </header>

        <article className="prose prose-lg dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap">{project.content}</pre>
        </article>

        <footer className="mt-16 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Project completed on {formatDate(project.date)}
            </div>
            <div className="flex gap-4">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors text-sm"
                >
                  View Source →
                </a>
              )}
              <Link
                to="/projects"
                className="text-primary hover:text-primary/80 transition-colors text-sm"
              >
                View all projects →
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
