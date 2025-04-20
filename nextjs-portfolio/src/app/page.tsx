import { Code, Terminal, BookOpen, Folder, User } from "lucide-react";
import Link from "next/link";

export default function Home() {
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
          Hello, I’m <span className="text-accent"><span className="name-blue">Angel Ortega-Melton</span></span>
        </h1>
        <p className="text-lg text-zinc-300 max-w-2xl mx-auto mb-6">
          I am a finance major and a software developer who utilizes and leverages AI tools for speed, efficiency, and learning. With experience in Python, JavaScript, and web development fundamentals, I focus on creating innovative solutions with modern technologies. My background in customer service and operational logistics, combined with my technical and analytical skills, allows me to adapt quickly and solve complex problems. I am passionate about combining my finance knowledge and software development expertise to build impactful projects and accelerate my learning journey.
        </p>
        <div className="flex gap-4 justify-center mb-4">
          <a href="/projects" className="bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded flex items-center gap-2 transition">View Projects <Folder className="h-4 w-4" /></a>
          <a href="/about" className="border border-accent text-accent hover:text-accent-light px-6 py-2 rounded flex items-center gap-2 transition">About Me <User className="h-4 w-4" /></a>
        </div>
      </div>

      {/* Recent Articles Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center gap-2"><BookOpen className="text-accent" /> Recent Articles</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Sample Article */}
          <a href="/crypto/development/2025/03/29/.html" className="glass-card glow-effect bg-abyss-light p-6 rounded-xl shadow-lg hover:scale-[1.02] transition block">
            {(() => {
  const articleTitle = 'SUI: BITCOIN’S  - WHY THIS BLOCKCHAIN KNIGHT WILL SLAUGHTER ETHEREUM AND SOLANA';
  const highlight = /crypto|btc|bitcoin/i.test(articleTitle) ? 'text-bitcoin' : 'text-accent';
  return (
    <h3 className={`text-xl font-semibold mb-2 ${highlight}`}>{articleTitle}</h3>
  );
})()}

            <p className="text-zinc-300 mb-2">March 29, 2025</p>
            <p className="text-zinc-400 mb-4">A deep dive into why SUI blockchain is poised to outperform Ethereum and Solana. Blockchain, AI, and system design insights.</p>
            <span className="text-accent-light font-medium">Read more →</span>
          </a>
        </div>
      </section>

      {/* Latest Projects Section */}
      <section className="container mx-auto px-4 pb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center gap-2"><Code className="text-accent" /> Latest Projects</h2>
        <div className="grid md:grid-cols-2 gap-8">
  {/* Trend2Zero Project */}
  <a href="https://github.com/Angleito/Trend2Zero" target="_blank" rel="noopener noreferrer" className="glass-card glow-effect bg-abyss-light p-6 rounded-xl shadow-lg hover:scale-[1.02] transition block" data-testid="project-card">
    <h3 className="text-xl font-semibold text-accent mb-2">Trend2Zero</h3>
    <p className="text-zinc-400 mb-2">Track global assets like stocks, gold, oil, and indices priced in Bitcoin. Visualize how every asset trends to zero in Bitcoin terms. Interactive charts, comprehensive data, and a true value perspective.</p>
    <div className="text-accent-light hover:underline">View Project</div>
  </a>
  {/* BluefinAI Agent Trader Project */}
  <a href="https://github.com/Angleito/bluefinaitradertemplate" target="_blank" rel="noopener noreferrer" className="glass-card glow-effect bg-abyss-light p-6 rounded-xl shadow-lg hover:scale-[1.02] transition block" data-testid="project-card">
    <h3 className="text-xl font-semibold text-accent mb-2">BluefinAI Agent Trader</h3>
    <p className="text-zinc-400 mb-2">AI-powered crypto trading</p>
    <div className="text-accent-light hover:underline">View Project</div>
  </a>
  {/* Stripe MVP Project */}
  <a href="https://github.com/Angleito/StripeMVP" target="_blank" rel="noopener noreferrer" className="glass-card glow-effect bg-abyss-light p-6 rounded-xl shadow-lg hover:scale-[1.02] transition block" data-testid="project-card">
    <h3 className="text-xl font-semibold text-accent mb-2">Stripe MVP</h3>
    <p className="text-zinc-400 mb-2">Minimal Stripe payment demo</p>
    <div className="text-accent-light hover:underline">View Project</div>
  </a>
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
