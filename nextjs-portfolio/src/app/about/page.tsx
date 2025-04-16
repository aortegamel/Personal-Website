import { User } from "lucide-react";

import Navbar from "../components/Navbar";

export default function About() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-abyss-dark flex items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-2xl w-full bg-abyss-light glass-card p-10 rounded-xl shadow-lg text-center space-y-6">
        <User className="w-16 h-16 mx-auto text-accent mb-2 glow-effect" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">About <span className="name-blue">Angel Ortega-Melton</span></h1>
        <p className="text-lg text-zinc-300 mb-6">
  Hi, I&apos;m <span className="name-blue font-semibold">Angel Ortega-Melton</span> — an aspiring programmer leveraging AI tools to accelerate learning and project building. With experience in Python, JavaScript, and web development fundamentals, I focus on creating innovative solutions with modern technologies. I have a strong background in customer service and operational logistics with a proven ability to adapt to different environments and learn new skills quickly. I&apos;m seeking opportunities to combine my technical learning journey and customer-focused background in a software development role.
</p>
        <div className="flex flex-col gap-2 text-zinc-400">
          <span>💻 Software Developer</span>
          <span>🚀 Performance Optimizer</span>
          <span>🌊 Always Learning</span>
        </div>
        <div className="mt-8">
          <a href="/projects" className="bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded transition mr-2">View My Projects</a>
          <a href="mailto:angleito@example.com" className="border border-accent text-accent hover:text-accent-light px-6 py-2 rounded transition">Contact Angleito</a>
        </div>
      </div>
    </div>
    </>
  );
}
