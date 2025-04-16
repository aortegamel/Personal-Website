import { loadPosts } from '@/lib/content-loader';

export default function Home() {
  const sortedPosts = loadPosts();
  const recentPosts = sortedPosts.slice(0, 3);

  // Featured projects
  const featuredProjects = [
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
    <main className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-6">Welcome to My Portfolio</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Exploring technology, sharing insights, and showcasing projects that push the boundaries of innovation.
        </p>
      </section>

      {/* Featured Projects Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">Featured Projects</h2>
          <a 
            href="/projects"
            className="text-blue-600 hover:text-blue-800 transition"
          >
            View All Projects →
          </a>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <a
              key={project.slug}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-3">{project.name}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">Recent Posts</h2>
          <a 
            href="/posts"
            className="text-blue-600 hover:text-blue-800 transition"
          >
            View All Posts →
          </a>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <div key={post.slug} className="post-preview">
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-600">{post.excerpt}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
