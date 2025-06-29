import Link from 'next/link';

export const metadata = {
  title: 'About Me - Angleito\'s Portfolio',
  description: 'Learn more about Angel Ortega-Melton, my background, skills, and projects.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">About Me</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Background</h2>
        <p className="text-lg text-gray-700 mb-4">
          I'm a finance graduate who has embraced the power of AI agentic coding to transform into a capable software developer. 
          By mastering tools like Claude Code, Aider, GitHub Copilot, and Cursor, I've accelerated my learning journey and 
          development capabilities far beyond traditional paths. These AI assistants have enabled me to build sophisticated 
          projects with efficiency and creativity.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          With experience in Python, JavaScript, and web development, I leverage AI to create innovative solutions that 
          combine my finance background with cutting-edge technologies. The partnership between my domain knowledge and 
          AI assistance has proven to be a powerful combination for solving complex problems.
        </p>
        <p className="text-lg text-gray-700">
          My background in customer service and operational logistics provides me with a unique perspective on user needs 
          and system design. I'm passionate about demonstrating how AI-assisted development can empower people from diverse 
          backgrounds to contribute meaningfully to the tech industry, and I'm seeking opportunities to further develop 
          this AI-augmented approach to software creation.
        </p>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Programming Languages</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Python</li>
              <li>JavaScript/TypeScript</li>
              <li>HTML/CSS</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Technologies & Frameworks</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>React.js</li>
              <li>Next.js</li>
              <li>Node.js</li>
              <li>Blockchain (Sui)</li>
              <li>Docker</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">AI & Agentic Coding Tools</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Claude Code</li>
              <li>Aider AI Pair Programming</li>
              <li>GitHub Copilot</li>
              <li>Cursor AI</li>
              <li>LangChain</li>
              <li>Prompt Engineering</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Soft Skills</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Problem-solving</li>
              <li>Customer service</li>
              <li>Adaptability</li>
              <li>Quick learning</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Projects</h2>
        <p className="text-lg text-gray-700 mb-4">
          I've worked on various projects focusing on blockchain development, AI integration, and web applications.
          Some of my notable projects include:
        </p>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>
            <strong>Single Agent Trader:</strong> AI-Powered Cryptocurrency Trading Platform using Claude for chart analysis
          </li>
          <li>
            <strong>QwenSuiCoder:</strong> End-to-end LLM Benchmarking & Training Framework for Sui blockchain development
          </li>
          <li>
            <strong>bot:</strong> Automated DeFi Trading on Sui leveraging DEX aggregation
          </li>
        </ul>
        <div className="mt-4">
          <Link 
            href="/projects" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View all projects &rarr;
          </Link>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-4">Contact</h2>
        <p className="text-lg text-gray-700 mb-4">
          Feel free to reach out to me at{' '}
          <a 
            href="mailto:arainey555@gmail.com" 
            className="text-blue-600 hover:text-blue-800"
          >
            arainey555@gmail.com
          </a>{' '}
          or connect with me on{' '}
          <a 
            href="https://github.com/Angleito" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            GitHub
          </a>.
        </p>
        <p className="text-lg text-gray-700">
          I'm open to discussing my projects in more detail, including access to full implementations not publicly available.
        </p>
      </section>
    </div>
  );
}
