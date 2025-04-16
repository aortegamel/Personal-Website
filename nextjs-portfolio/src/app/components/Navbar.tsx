// Shared Navbar component for all pages
import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-center py-6 bg-abyss-light/80 backdrop-blur glass-card text-white sticky top-0 z-10">
      <ul className="flex gap-8 text-lg font-medium">
        <li>
          <Link href="/" className="hover:text-accent transition">Home</Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-accent transition">About</Link>
        </li>
        <li>
          <Link href="/projects" className="hover:text-accent transition">Projects</Link>
        </li>
        <li>
          <Link href="/articles" className="hover:text-accent transition">Articles</Link>
        </li>
        <li>
          <Link href="/categories" className="hover:text-accent transition">Categories</Link>
        </li>
        <li>
          <Link href="/search" className="hover:text-accent transition">Search</Link>
        </li>
      </ul>
    </nav>
  );
}
