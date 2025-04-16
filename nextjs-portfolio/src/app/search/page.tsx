import { Search } from "lucide-react";

import Navbar from "../components/Navbar";

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-abyss-dark flex items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-xl w-full bg-abyss-light glass-card p-10 rounded-xl shadow-lg text-center space-y-8">
        <Search className="w-16 h-16 mx-auto text-accent mb-2 glow-effect" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Search</h1>
        <input
          type="text"
          placeholder="Type to search articles, projects, or categories..."
          className="w-full p-3 rounded-lg bg-abyss-dark border border-accent-light text-zinc-200 focus:outline-none focus:ring-2 focus:ring-accent mb-4"
        />
        <div className="text-zinc-400">(Search functionality coming soon!)</div>
      </div>
    </div>
    </>
  );
}
