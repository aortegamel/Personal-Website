import { getAllMdxPosts } from "../lib/mdx-posts";
import { Code, Terminal, BookOpen, Folder, User } from "lucide-react";
import Link from "next/link";
import { format } from 'date-fns'

interface FeaturedProject {
  name: string;
  description: string;
  techStack: string[];
  slug: string;
  url: string;
}

export default function Home() {
  // Get recent MDX posts
  const recentPosts = getAllMdxPosts().slice(0, 3); // type: MdxPostMeta[]

  // Featured projects
  const featuredProjects: FeaturedProject[] = [
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

  return (
    <div className="min-h-screen bg-abyss-dark font-[family-name:var(--font-geist-sans)] flex flex-col">
      {/* Navigation */}
      <nav className="w-full flex justify-center py-6 bg-abyss-light/80 backdrop-blur glass-card text-white sticky top-0 z-10">
        <ul className="flex gap-8 text-lg font-medium">
          <li><Link href="/" className="hover:text-accent transition">Home</Link></li>
          <li><a href="/about" className="hover:text-accent transition">About</a></li>
          <li><a href="/projects" className="hover:text-accent transition">Projects</a></li>
          <li><a href="/articles" className="hover:text-accent transition">Articles</a></li>
          <li><a href="/categories" className="hover:text-accent transition">Categories</a></li>
          <li><a href="/search" className="hover:text-accent transition">Search</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <div className="container px-4 py-16 mx-auto text-center">
        <Terminal className="w-16 h-16 mx-auto text-accent animate-glow mb-4" />
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4">
          Hello, I&apos;m <span className="text-accent"><span className="name-blue">Angel Ortega-Melton</span></span>
        </h1>
        <p className="text-lg text-zinc-300 max-w-2xl mx-auto mb-6">
          I&apos;m a new aspiring programmer leveraging AI tools to accelerate learning and project building. With experience in Python, JavaScript, and web development fundamentals, I focus on creating innovative solutions with modern technologies. I have a strong background in customer service and operational logistics with proven ability to adapt to different environments and learn new skills quickly. I&apos;m seeking opportunities to combine my technical learning journey and customer-focused background in a software development role.
        </p>
        <div className="flex gap-4 justify-center mb-4">
          <a href="/projects" className="bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded flex items-center gap-2 transition">View Projects <Folder className="h-4 w-4" /></a>
          <a href="/about" className="border border-accent text-accent hover:text-accent-light px-6 py-2 rounded flex items-center gap-2 transition">About Me <User className="h-4 w-4" /></a>
        </div>
      </div>

      {/* Latest Projects Section */}
      <section className="container mx-auto px-4 pb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center gap-2"><Code className="text-accent" /> Latest Projects</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <a 
              key={project.slug}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card glow-effect bg-abyss-light p-6 rounded-xl shadow-lg hover:scale-[1.02] transition block"
            >
              <h3 className="text-xl font-semibold text-accent mb-2">{project.name}</h3>
              <p className="text-zinc-400 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-block bg-accent-light/20 border border-accent-light rounded-full px-3 py-1 text-sm font-semibold text-accent-light"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <span className="text-accent-light hover:underline">View Project →</span>
            </a>
          ))}
        </div>
      </section>

      {/* Recent Articles Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center gap-2"><BookOpen className="text-accent" /> Recent Articles</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {recentPosts.map((post: import("../../lib/mdx-posts").MdxPostMeta) => (
            <Link 
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="glass-card glow-effect bg-abyss-light p-6 rounded-xl shadow-lg hover:scale-[1.02] transition block"
            >
              <h3 className="text-xl font-semibold text-accent mb-2">{post.title}</h3>
              <p className="text-zinc-300 mb-2">{format(new Date(post.date), 'MMMM dd, yyyy')}</p>
              <p className="text-zinc-400 mb-4">{post.excerpt}</p>
              <span className="text-accent-light font-medium">Read more →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 bg-abyss-light/80 backdrop-blur glass-card text-center text-zinc-400 mt-auto">
        <div className="mb-2">© 2025 <span className="name-blue">Angel Ortega-Melton</span>. All rights reserved.</div>
        <div className="flex justify-center gap-4 text-accent text-lg">
          <a href="https://github.com/Angleito" className="hover:text-accent-light transition">GitHub</a>
          <span>|</span>
          <a href="mailto:arainey555@gmail.com" className="hover:text-accent-light transition">Email</a>
        </div>
      </footer>
    </div>
  );
}
