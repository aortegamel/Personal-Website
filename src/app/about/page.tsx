import Link from 'next/link';

export const metadata = {
  title: 'About Me - Angleito\'s Portfolio',
  description: 'Learn more about Angel Ortega-Melton, my background, skills, and projects.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen relative">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-bitcoin-500/10 rounded-full filter blur-[128px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-abyss-400/10 rounded-full filter blur-[128px] animate-pulse animation-delay-2000" />
      </div>
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-5xl md:text-6xl font-bold mb-12 font-montserrat">
          <span className="bg-gradient-to-r from-bitcoin-400 via-bitcoin-300 to-bitcoin-500 bg-clip-text text-transparent">
            About Me
          </span>
        </h1>
      
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4 text-abyss-100">Background</h2>
        <p className="text-lg text-abyss-200 mb-4 leading-relaxed">
          I'm a finance graduate who has embraced the power of AI agentic coding to transform into a capable software developer. 
          By mastering tools like Claude Code, Aider, GitHub Copilot, and Cursor, I've accelerated my learning journey and 
          development capabilities far beyond traditional paths. These AI assistants have enabled me to build sophisticated 
          projects with efficiency and creativity.
        </p>
        <p className="text-lg text-abyss-200 mb-4 leading-relaxed">
          With experience in Python, JavaScript, and web development, I leverage AI to create innovative solutions that 
          combine my finance background with cutting-edge technologies. The partnership between my domain knowledge and 
          AI assistance has proven to be a powerful combination for solving complex problems.
        </p>
        <p className="text-lg text-abyss-200 leading-relaxed">
          My background in customer service and operational logistics provides me with a unique perspective on user needs 
          and system design. I'm passionate about demonstrating how AI-assisted development can empower people from diverse 
          backgrounds to contribute meaningfully to the tech industry, and I'm seeking opportunities to further develop 
          this AI-augmented approach to software creation.
        </p>
      </section>
      
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4 text-abyss-100">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-deepSea-middle/20 backdrop-blur-sm border border-bitcoin-500/20 rounded-xl p-6 hover:border-bitcoin-500/40 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-3 text-bitcoin-400">Programming Languages</h3>
            <ul className="list-disc list-inside space-y-2 text-abyss-200 ml-4">
              <li>Python</li>
              <li>JavaScript/TypeScript</li>
              <li>HTML/CSS</li>
            </ul>
          </div>
          <div className="bg-deepSea-middle/20 backdrop-blur-sm border border-bitcoin-500/20 rounded-xl p-6 hover:border-bitcoin-500/40 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-3 text-bitcoin-400">Technologies & Frameworks</h3>
            <ul className="list-disc list-inside space-y-2 text-abyss-200 ml-4">
              <li>React.js</li>
              <li>Next.js</li>
              <li>Node.js</li>
              <li>Blockchain (Sui)</li>
              <li>Docker</li>
            </ul>
          </div>
          <div className="bg-deepSea-middle/20 backdrop-blur-sm border border-bitcoin-500/20 rounded-xl p-6 hover:border-bitcoin-500/40 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-3 text-bitcoin-400">AI & Agentic Coding Tools</h3>
            <ul className="list-disc list-inside space-y-2 text-abyss-200 ml-4">
              <li>Claude Code</li>
              <li>Aider AI Pair Programming</li>
              <li>GitHub Copilot</li>
              <li>Cursor AI</li>
              <li>LangChain</li>
              <li>Prompt Engineering</li>
            </ul>
          </div>
          <div className="bg-deepSea-middle/20 backdrop-blur-sm border border-bitcoin-500/20 rounded-xl p-6 hover:border-bitcoin-500/40 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-3 text-bitcoin-400">Soft Skills</h3>
            <ul className="list-disc list-inside space-y-2 text-abyss-200 ml-4">
              <li>Problem-solving</li>
              <li>Customer service</li>
              <li>Adaptability</li>
              <li>Quick learning</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4 text-abyss-100">Projects</h2>
        <p className="text-lg text-abyss-200 mb-4 leading-relaxed">
          I've worked on various projects focusing on blockchain development, AI integration, and web applications.
          Some of my notable projects include:
        </p>
        <ul className="list-disc list-inside space-y-3 text-abyss-200 ml-4">
          <li>
            <strong className="text-bitcoin-400">Single Agent Trader:</strong> AI-Powered Cryptocurrency Trading Platform using Claude for chart analysis
          </li>
          <li>
            <strong className="text-bitcoin-400">QwenSuiCoder:</strong> End-to-end LLM Benchmarking & Training Framework for Sui blockchain development
          </li>
          <li>
            <strong className="text-bitcoin-400">bot:</strong> Automated DeFi Trading on Sui leveraging DEX aggregation
          </li>
        </ul>
        <div className="mt-4">
          <Link 
            href="/projects" 
            className="text-bitcoin-400 hover:text-bitcoin-300 font-medium transition-colors inline-flex items-center gap-1"
          >
            View all projects &rarr;
          </Link>
        </div>
      </section>
      
      <section>
        <h2 className="text-3xl font-bold mb-4 text-abyss-100">Contact</h2>
        <p className="text-lg text-abyss-200 mb-4 leading-relaxed">
          Feel free to reach out to me at{' '}
          <a 
            href="mailto:arainey555@gmail.com" 
            className="text-bitcoin-400 hover:text-bitcoin-300 underline transition-colors"
          >
            arainey555@gmail.com
          </a>{' '}
          or connect with me on{' '}
          <a 
            href="https://github.com/Angleito" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-bitcoin-400 hover:text-bitcoin-300 underline transition-colors"
          >
            GitHub
          </a>.
        </p>
        <p className="text-lg text-abyss-200 leading-relaxed">
          I'm open to discussing my projects in more detail, including access to full implementations not publicly available.
        </p>
      </section>
      </div>
    </div>
  );
}
