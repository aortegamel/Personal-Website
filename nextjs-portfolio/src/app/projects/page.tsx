interface Project {
  slug: string;
  name: string;
  description: string;
  techStack: string[];
}

const allProjects: Project[] = [
  {
    slug: 'Trend2Zero',
    name: 'Trend2Zero',
    description: 'Interactive charts of global assets priced in Bitcoin to show their trend to zero.',
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Chart.js', 'Bitcoin Data APIs'],
  },
  {
    slug: 'SuiFlashBotTemplate',
    name: 'Sui Flash Bot Template',
    description: 'Template to build Sui flash bots in TS with Docker.',
    techStack: ['TypeScript', 'Node.js', 'Sui SDK', 'Navi SDK', 'Suilend SDK', 'Jest', 'Docker'],
  },
  {
    slug: 'bluefinaitradertemplate',
    name: 'BluefinAI Agent Trader',
    description: 'AI-powered crypto trading agent with microservices with Claude and Perplexity AI chart analysis.',
    techStack: ['Python', 'aiohttp', 'httpx', 'pandas', 'numpy', 'pydantic', 'Prometheus', 'pytest'],
  },
  {
    slug: 'qwensuicoder',
    name: 'Qwen Sui Coder',
    description: 'LLM code assistant trained on Sui SDK docs for Sui development tasks.',
    techStack: ['Python', 'PyTorch', 'TorchVision', 'NumPy', 'Matplotlib', 'Requests', 'Rich'],
  },
  {
    slug: 'Angleito.github.io',
    name: 'Personal Website',
    description: 'Next.js site showcasing my articles and projects with Contentlayer integration.',
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Contentlayer', 'Playwright'],
  },
  {
    slug: 'StripeMVP',
    name: 'Stripe MVP',
    description: 'Demonstrates a minimal Stripe payment integration using modern web stack.',
    techStack: ['Vite', 'Tailwind CSS', 'Alpine.js', 'Laravel Vite Plugin', 'Axios'],
  },
];

import Navbar from "../components/Navbar";

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-abyss-dark flex items-center justify-center font-[family-name:var(--font-geist-sans)]">
        <div className="max-w-5xl w-full p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-10 text-center">
            Projects by <span className="text-accent"><span className="name-blue">Angel Ortega-Melton</span></span>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProjects.map((project: Project) => (
              <a
                key={project.slug}
                href={
                  project.slug === 'Trend2Zero' ? 'https://github.com/Angleito/Trend2Zero'
                  : project.slug === 'SuiFlashBotTemplate' ? 'https://github.com/Angleito/SuiFlashBotTemplate'
                  : project.slug === 'bluefinaitradertemplate' ? 'https://github.com/Angleito/bluefinaitradertemplate'
                  : project.slug === 'qwensuicoder' ? 'https://github.com/Angleito/qwensuicoder'
                  : project.slug === 'Angleito.github.io' ? 'https://github.com/Angleito/Angleito.github.io'
                  : project.slug === 'StripeMVP' ? 'https://github.com/Angleito/StripeMVP'
                  : '#'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card glow-effect bg-abyss-light p-6 rounded-xl shadow-lg hover:scale-[1.02] transition block"
              >
                <h2 className={`text-2xl font-semibold mb-2 ${/crypto|btc|bitcoin/i.test(project.name) ? 'text-bitcoin' : 'text-accent'}`}>{project.name}</h2>
                <p className="text-zinc-300 mb-4">{project.description}</p>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-block bg-accent-light/20 border border-accent-light rounded-full px-3 py-1 text-sm font-semibold text-accent-light"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-accent-light hover:underline">View Project</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}