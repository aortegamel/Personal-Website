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
          My journey started at UNR studying mechanical engineering, sparked by a love for physics I discovered in 
          my AP Physics class. Life had other plans though—family health issues forced me to leave and reevaluate my path. 
          When I returned to school, I chose finance because it felt more manageable and aligned with my passion for 
          trading crypto, stocks, and forex. But something was missing.
        </p>
        <p className="text-lg text-abyss-200 mb-4 leading-relaxed">
          I missed the engineering mindset, the systematic problem-solving, the building of things. I'd always wanted 
          to learn to code, but the entry barrier felt insurmountable. Unlike many of my friends who had coding 
          experience from high school, I was starting from absolute zero. Traditional learning paths seemed too 
          time-consuming and overwhelming for someone juggling work and studies.
        </p>
        <p className="text-lg text-abyss-200 mb-4 leading-relaxed">
          Then AI changed everything. Tools like Claude Code and Cursor didn't just help me write code faster—they 
          became my coding mentors, breaking down that intimidating entry ceiling I'd been staring at for years. 
          Suddenly, I could build the things I'd always envisioned, learning by doing instead of spending months 
          on syntax and theory. AI accelerated my learning curve so dramatically that I could finally bridge my 
          finance background with the engineering thinking I'd been craving.
        </p>
        <p className="text-lg text-abyss-200 mb-4 leading-relaxed">
          My years at Chipotle and Skechers might seem unrelated to coding, but they're actually my superpower. 
          At Chipotle, when the grill broke during lunch rush or the POS system froze with a line out the door, 
          I learned to troubleshoot under pressure while keeping customers informed and happy. At Skechers, helping 
          customers find the right fit meant really listening to their needs and translating those into actionable 
          solutions. Now when a production bug hits, I don't panic—I systematically work through the problem the 
          same way I'd handle a kitchen crisis, and I explain technical issues to stakeholders with the same 
          clarity I used when helping customers understand shoe features or ingredient modifications.
        </p>
        <p className="text-lg text-abyss-200 leading-relaxed">
          My finance background gives me a unique lens for software development. When I'm architecting a system, 
          I think about technical debt the same way I'd analyze financial risk—what are the long-term costs of this 
          quick fix? When reviewing user analytics, my finance training kicks in to spot patterns and anomalies that 
          others might miss. It's this blend of customer service empathy, financial analytical thinking, and 
          AI-enhanced development that makes me approach every project with both technical precision and genuine 
          understanding of the humans who'll actually use what I build.
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
