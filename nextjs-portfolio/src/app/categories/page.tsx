import { Folder } from "lucide-react";

import Navbar from "../components/Navbar";

export default function Categories() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-abyss-dark flex items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-2xl w-full bg-abyss-light glass-card p-10 rounded-xl shadow-lg text-center space-y-8">
        <Folder className="w-16 h-16 mx-auto text-accent mb-2 glow-effect" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Categories</h1>
        <div className="space-y-4 text-zinc-300">
          <div className="glass-card bg-abyss-dark p-4 rounded-lg border border-accent">Blockchain</div>
          <div className="glass-card bg-abyss-dark p-4 rounded-lg border border-accent">AI & Machine Learning</div>
          <div className="glass-card bg-abyss-dark p-4 rounded-lg border border-accent">Web Development</div>
          <div className="glass-card bg-abyss-dark p-4 rounded-lg border border-accent">System Design</div>
          {/* Add more categories as needed */}
        </div>
      </div>
    </div>
    </>
  );
}
