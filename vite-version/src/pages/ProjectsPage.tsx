import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ContentMeta } from '../types/content'
import { getAllProjects } from '../lib/content-loader'
import { formatDate } from '../lib/utils'
import { ProjectCard } from '../components/common/ProjectCard'

export function ProjectsPage() {
  const [projects, setProjects] = useState<ContentMeta[]>([])
  const [filteredProjects, setFilteredProjects] = useState<ContentMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  // Get unique tags for filtering
  const allTags = Array.from(new Set(projects.flatMap(project => project.tags)))

  useEffect(() => {
    getAllProjects()
      .then((allProjects) => {
        setProjects(allProjects)
        setFilteredProjects(allProjects)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let filtered = projects

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.tags.some(tag => tag.toLowerCase().includes(term))
      )
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(project => project.tags.includes(selectedTag))
    }

    setFilteredProjects(filtered)
  }, [projects, searchTerm, selectedTag])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedTag('')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="spinner mx-auto"></div>
          <p className="loading-text">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-bitcoin-400 via-bitcoin-300 to-abyss-400 bg-clip-text text-transparent">
          All Projects
        </h1>
        <p className="text-xl text-abyss-200 max-w-3xl mx-auto">
          A collection of my work in blockchain, DeFi, and web development
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 abyss-input"
          />
          <button
            onClick={clearFilters}
            className="btn-ghost"
          >
            Clear Filters
          </button>
        </div>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-abyss-300 py-2">Technologies:</span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                  selectedTag === tag
                    ? 'bg-bitcoin-500 text-deepSea-abyss shadow-bitcoin'
                    : 'bg-deepSea-surface/50 text-abyss-300 hover:bg-deepSea-surface hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6 text-sm text-abyss-400">
        Showing {filteredProjects.length} of {projects.length} projects
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-abyss-300 text-lg">
            {searchTerm || selectedTag 
              ? 'No projects found matching your filters.' 
              : 'No projects available.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 stagger-in">
          {filteredProjects.map((project, index) => (
            <article 
              key={project.slug} 
              className="animate-fade-in-up"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'forwards'
              }}
            >
              <div className="abyss-card h-full">
                <h2 className="text-2xl font-semibold mb-3">
                  <Link 
                    to={`/projects/${project.slug}`} 
                    className="link-morph"
                  >
                    {project.title}
                  </Link>
                </h2>
                
                <p className="text-abyss-200 mb-6 line-clamp-3 text-lg">
                  {project.description}
                </p>

                {/* Tags */}
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="badge badge-bitcoin"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Metadata and Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-sm text-abyss-400">
                    {formatDate(project.date)}
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="abyss-button"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                {project.featured && (
                  <div className="mt-4">
                    <span className="badge badge-ocean">
                      Featured Project
                    </span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}