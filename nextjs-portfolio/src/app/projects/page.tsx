interface Project {
  slug: string;
  name: string;
  description: string;
  techStack: string[];
  url: string;
}

const allProjects: Project[] = [
  {
    name: "Trend2Zero",
    description: "Automated trading bot using zero-based momentum strategy with advanced risk management",
    techStack: ["Python", "Pandas", "NumPy", "ccxt", "AWS Lambda"],
    slug: "trend2zero",
    url: "https://github.com/Angleito/Trend2Zero"
  },
  {
    name: "BluefinAI Agent Template",
    description: "Customizable template for creating AI-powered trading agents on the Bluefin DEX",
    techStack: ["TypeScript", "Node.js", "Bluefin API", "Docker"],
    slug: "bluefinaitradertemplate",
    url: "https://github.com/Angleito/bluefinaitradertemplate"
  },
  {
    name: "Stripe MVP",
    description: "Minimalist e-commerce solution with Stripe integration and automated payment processing",
    techStack: ["Next.js", "Stripe API", "Tailwind CSS", "TypeScript"],
    slug: "stripemvp",
    url: "https://github.com/Angleito/StripeMVP"
  }
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
                href={project.url}
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