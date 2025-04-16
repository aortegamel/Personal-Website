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
    description: 'Track global assets like stocks, gold, oil, and indices priced in Bitcoin. Visualize how every asset trends to zero in Bitcoin terms. Interactive charts, comprehensive data, and a true value perspective.',
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Chart.js', 'Bitcoin Data APIs'],
  },
  {
    slug: 'SuiFlashBotTemplate',
    name: 'SuiFlashBotTemplate',
    description: 'A template for building Sui flash bots.',
    techStack: ['TypeScript', 'Node.js', 'Sui SDK', 'Navi SDK', 'Suilend SDK', 'Jest', 'Docker'],
  },
  {
    slug: 'bluefinaitradertemplate',
    name: 'bluefinaitradertemplate',
    description: 'Template for my Bluefin AI Trader. Mock and Simulated Version of my real project.',
    techStack: ['Python', 'aiohttp', 'httpx', 'pandas', 'numpy', 'pydantic', 'Prometheus', 'pytest'],
  },
  {
    slug: 'qwensuicoder',
    name: 'qwensuicoder',
    description: "Qwen 2.5 Coder trained on Sui Documentation and SDK as well as many Sui ecosystem SDK's and documentations.",
    techStack: ['Python', 'PyTorch', 'TorchVision', 'NumPy', 'Matplotlib', 'Requests', 'Rich'],
  },
  {
    slug: 'Angleito.github.io',
    name: 'Angleito.github.io',
    description: 'My personal website to host my articles and projects.',
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Contentlayer', 'Playwright'],
  },
  {
    slug: 'StripeMVP',
    name: 'StripeMVP',
    description: 'A minimal Stripe integration MVP for learning payment processing.',
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