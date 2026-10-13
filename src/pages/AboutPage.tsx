import { useState } from 'react'
import { Seo } from '../components/Seo'
import { site } from '../site'
import { ParticleCTA } from '../components/ui/particle-cta'

export function AboutPage() {
  const [activeSection, setActiveSection] = useState('about')

  const sections: Record<string, string> = {
    about: 'About',
    experience: 'Experience',
    contact: 'Contact'
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Seo
        title={`About | ${site.name}`}
        description="Software engineer building AI-integrated applications, agent tooling, and data pipelines."
        path="/about"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          headline: `About | ${site.name}`,
          description: 'Software engineer building AI-integrated applications, agent tooling, and data pipelines.',
          author: { '@type': 'Person', name: site.name },
        }}
      />
      <ParticleCTA className="rounded-2xl">
        <div className="py-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-bitcoin-400 via-bitcoin-300 to-abyss-400 bg-clip-text text-transparent">
                About {site.shortName}
              </h1>
              <p className="text-xl text-abyss-200 max-w-2xl mx-auto">
                Software engineer building AI-integrated applications, agent tooling, and data pipelines.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex justify-center mb-12 px-4">
              <div className="bg-deepSea-surface/50 backdrop-blur-sm border border-abyss-400/20 rounded-lg p-1 inline-flex max-w-full overflow-x-auto">
                {Object.entries(sections).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`px-6 py-2 rounded-md transition-all duration-300 ${activeSection === key
                      ? 'bg-bitcoin-500 text-deepSea-abyss shadow-bitcoin'
                      : 'text-abyss-300 hover:text-white'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-12">
              {/* About Section */}
              {activeSection === 'about' && (
                <section className="space-y-8 animate-fade-in">
                  <div className="prose prose-lg prose-invert max-w-none">
                    <h2 className="text-3xl font-bold mb-6 text-bitcoin-400">Who I Am</h2>
                    <p className="text-lg leading-relaxed mb-6 text-abyss-200">
                      I originally went to UNR to study mechanical engineering after discovering how much I
                      enjoyed my AP physics class in high school. I loved every second of my engineering
                      classes: problem solving, the math (which I used to hate), and the process of
                      understanding how complex systems worked and how to apply them to real life.
                    </p>

                    <p className="text-lg leading-relaxed mb-6 text-abyss-200">
                      Then the pandemic hit. I felt lost and alone, and spiraled out of college.
                    </p>

                    <p className="text-lg leading-relaxed mb-6 text-abyss-200">
                      For a while, software engineering remained something I wanted to pursue but kept putting
                      off. I had always been interested in programming, but I knew people who had been coding
                      since they were kids, and I convinced myself I was already too far behind.
                    </p>

                    <p className="text-lg leading-relaxed mb-6 text-abyss-200">
                      In 2024, I finally decided that didn&apos;t matter. I started from the beginning: HTML,
                      then Python, TypeScript, APIs, databases, and the fundamentals of building software. At
                      first, progress felt slow. I knew I could understand technical concepts, but I hadn&apos;t
                      found a way of learning that matched how I naturally think.
                    </p>

                    <p className="text-lg leading-relaxed mb-6 text-abyss-200">
                      Then I heard about AI. I started using AI as a learning tool. That changed everything.
                    </p>

                    <p className="text-lg leading-relaxed mb-6 text-abyss-200">
                      For me, it felt like being able to talk to a future version of myself, someone who could
                      explain a concept from five different angles, answer every follow-up question, and
                      immediately help me apply what I had learned.
                    </p>

                    <p className="text-lg leading-relaxed mb-6 text-abyss-200">
                      Not long after, I discovered AI-native development tools like Cursor and began working
                      with AI directly inside my development environment. That was the point where software
                      really clicked for me. Suddenly, I could take an idea and turn it into something real.
                    </p>

                    <p className="text-lg leading-relaxed mb-6 text-abyss-200">
                      Instead of learning concepts in isolation, I could learn by building. Just like in the
                      engineering classes I fell in love with, I could take these abstract things and see them
                      work in realtime. I could discover an API and immediately integrate it. When I encountered
                      an unfamiliar architecture or engineering concept, I could understand it in the context of
                      a system I was actively working on.
                    </p>

                    <p className="text-lg leading-relaxed mb-6 text-abyss-200">
                      That feedback loop became addictive.
                    </p>

                    <p className="text-lg leading-relaxed mb-6 text-abyss-200">
                      Since then, I&apos;ve spent most of my time building, experimenting, breaking things,
                      rebuilding them, and continually pushing toward more ambitious projects. My interests have
                      increasingly moved toward AI engineering, agentic systems, structured data, developer
                      tooling, and designing systems that make LLMs more reliable and useful.
                    </p>

                    <p className="text-lg leading-relaxed mb-6 text-abyss-200">
                      What started as learning how to write code became an interest in a much bigger question:
                      How can we use AI to make individuals capable of building things that previously required
                      entire teams? That&apos;s the problem space I want to keep exploring.
                    </p>

                    <h3 className="text-2xl font-semibold mb-4 text-bitcoin-400">What I Do</h3>
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="abyss-card">
                        <h4 className="text-xl font-semibold mb-3 text-bitcoin-300">AI-Integrated Applications</h4>
                        <p className="text-abyss-300">
                          Full-stack apps with AI at the core, from privacy-focused marketplaces on Sui to
                          investment research tools. Every AI claim carries provenance and quality checks.
                        </p>
                      </div>

                      <div className="abyss-card">
                        <h4 className="text-xl font-semibold mb-3 text-bitcoin-300">Agent Tooling</h4>
                        <p className="text-abyss-300">
                          Tool-using agents with structured outputs and prompt pipelines, built on the OpenAI API
                          and LangChain. Policy gates and human review keep autonomous behavior trustworthy.
                        </p>
                      </div>

                      <div className="abyss-card">
                        <h4 className="text-xl font-semibold mb-3 text-bitcoin-300">Data Pipelines</h4>
                        <p className="text-abyss-300">
                          Point-in-time datasets from SEC EDGAR and FINRA sources, versioned as JSON artifacts
                          and served through DuckDB over Parquet. Offline pytest suites with pyrefly and ruff gates.
                        </p>
                      </div>

                      <div className="abyss-card">
                        <h4 className="text-xl font-semibold mb-3 text-bitcoin-300">Full-Stack Web</h4>
                        <p className="text-abyss-300">
                          TypeScript and React front ends with Hono APIs, PostgreSQL, and Dockerized workers.
                          PWAs and Astro or Vite sites that ship fast and stay maintainable.
                        </p>
                      </div>
                    </div>

                    <h3 className="text-2xl font-semibold mb-4 text-bitcoin-400">Technologies I Work With</h3>
                    <div className="flex flex-wrap gap-3">
                      {[
                        'Python', 'TypeScript', 'JavaScript', 'Rust', 'Sui Move', 'React',
                        'Vite', 'Tailwind CSS', 'Hono', 'Astro', 'OpenAI API', 'LangChain',
                        'DuckDB', 'Parquet', 'pytest', 'Docker', 'Bun', 'Sui',
                        'Walrus', 'Seal', 'Nautilus'
                      ].map((tech) => (
                        <span
                          key={tech}
                          className="badge badge-bitcoin"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Experience Section */}
              {activeSection === 'experience' && (
                <section className="space-y-8 animate-fade-in">
                  <h2 className="text-3xl font-bold mb-8 text-bitcoin-400">Professional Journey</h2>

                  <div className="space-y-8">
                    <div className="border-l-4 border-bitcoin-500 pl-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                        <h3 className="text-xl font-semibold text-bitcoin-300">Lead Software Engineer (Freelance)</h3>
                        <span className="text-abyss-400">Apr 2025 - Feb 2026</span>
                      </div>
                      <p className="text-abyss-300 mb-3">Dreamlit Apps LLC, Remote</p>
                      <p className="leading-relaxed text-abyss-200">
                        Built a full-stack dApp environment with TypeScript, React, Sui Move, Walrus storage,
                        and AI integration. Shipped the S.O.N.A.R. audio marketplace end to end as sole creator.
                      </p>
                    </div>

                    <div className="border-l-4 border-abyss-500 pl-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                        <h3 className="text-xl font-semibold text-bitcoin-300">Warehouse 3rd Shift Supervisor</h3>
                        <span className="text-abyss-400">Mar 2020 - Dec 2023</span>
                      </div>
                      <p className="text-abyss-300 mb-3">Amazon, Reno, NV</p>
                      <p className="leading-relaxed text-abyss-200">
                        Coordinated overnight operations and built inventory-routing workflows that cut errors.
                        Led shift crews through high-volume deadlines with clear handoffs and accountability.
                      </p>
                    </div>
                  </div>

                  <div className="abyss-card mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-bitcoin-300">Key Achievements</h3>
                    <ul className="space-y-2 text-abyss-300">
                      <li>• Best Technical Implementation, Walrus Haulout Hackathon 2025, one of three winners from hundreds of entries across 27 countries</li>
                      <li>• Sole creator of S.O.N.A.R., a privacy-focused audio marketplace on Sui</li>
                      <li>• Shipped open-source Stockbot with verifiable, provenance-backed data</li>
                      <li>• Built inventory-routing workflows at Amazon that cut errors</li>
                    </ul>
                  </div>
                </section>
              )}

              {/* Contact Section */}
              {activeSection === 'contact' && (
                <section className="space-y-8 animate-fade-in">
                  <h2 className="text-3xl font-bold mb-8 text-bitcoin-400">Get In Touch</h2>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <p className="text-lg leading-relaxed text-abyss-200">
                        I&apos;m always interested in discussing AI-integrated applications, agent tooling,
                        data pipelines, and open-source collaboration.
                      </p>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <svg className="h-5 w-5 text-bitcoin-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                          </svg>
                          <a href={`mailto:${site.email}`} className="abyss-link">
                            {site.email}
                          </a>
                        </div>

                        <div className="flex items-center space-x-3">
                          <svg className="h-5 w-5 text-bitcoin-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          <a
                            href={site.social.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="abyss-link"
                          >
                            GitHub
                          </a>
                        </div>

                        <div className="flex items-center space-x-3">
                          <svg className="h-5 w-5 text-bitcoin-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                          <a
                            href={site.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="abyss-link"
                          >
                            LinkedIn
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="abyss-card">
                      <h3 className="text-xl font-semibold mb-4 text-bitcoin-300">Let's Collaborate</h3>
                      <p className="text-abyss-300 mb-4">
                        I'm particularly interested in projects involving:
                      </p>
                      <ul className="space-y-2 text-abyss-300">
                        <li>• AI-integrated applications</li>
                        <li>• Agent tooling</li>
                        <li>• Data pipelines</li>
                        <li>• Open-source AI and developer tools</li>
                      </ul>

                      <div className="mt-6">
                        <a
                          href={`mailto:${site.email}?subject=Collaboration Opportunity`}
                          className="bitcoin-button inline-block"
                        >
                          Send Message
                        </a>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </ParticleCTA >
    </div >
  )
}