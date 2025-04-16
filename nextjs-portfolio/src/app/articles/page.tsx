import { BookOpen } from "lucide-react";

import Navbar from "../components/Navbar";

export default function Articles() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-abyss-dark flex items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-3xl w-full bg-abyss-light glass-card p-10 rounded-xl shadow-lg text-center space-y-8">
        <BookOpen className="w-16 h-16 mx-auto text-accent mb-2 glow-orange" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Articles by <span className="name-blue">Angel Ortega-Melton</span></h1>
        <div className="space-y-4 text-zinc-300">
          <a href="/crypto/development/2025/03/29/.html" className="block glass-card bg-abyss-dark p-4 rounded-lg hover:bg-abyss-light transition border border-accent text-left">
            <h3
  className={`text-xl font-semibold mb-2 ${/crypto|btc|bitcoin/i.test('SUI: BITCOIN’S  - WHY THIS BLOCKCHAIN KNIGHT WILL SLAUGHTER ETHEREUM AND SOLANA') ? 'text-bitcoin' : 'text-accent'}`}
>
  SUI: BITCOIN’S  - WHY THIS BLOCKCHAIN KNIGHT WILL SLAUGHTER ETHEREUM AND SOLANA
</h3>
            <div className="text-xs text-zinc-400 mb-1">March 29, 2025</div>
            <div className="text-zinc-400">A deep dive into why SUI blockchain is poised to outperform Ethereum and Solana. Blockchain, AI, and system design insights.</div>
          </a>
          {/* Add more articles here */}
        </div>
      </div>
    </div>
    </>
  );
}
