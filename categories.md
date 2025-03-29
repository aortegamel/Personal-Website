---
layout: page
title: Categories
permalink: /categories/
---

# Article Categories

Browse articles by category:

<div class="category-list">
  <div class="category-item">
    <h2><a href="{{ '/categories/economics/' | relative_url }}">Economics</a></h2>
    <p>Articles about economic theories, market analysis, and financial insights.</p>
  </div>
  
  <div class="category-item">
    <h2><a href="{{ '/categories/crypto/' | relative_url }}">Crypto</a></h2>
    <p>Blockchain technology, cryptocurrency analysis, and DeFi innovations.</p>
  </div>
  
  <div class="category-item">
    <h2><a href="{{ '/categories/personal/' | relative_url }}">Personal</a></h2>
    <p>Personal stories, experiences, and reflections on my journey.</p>
  </div>
  
  <div class="category-item">
    <h2><a href="{{ '/categories/ai/' | relative_url }}">AI</a></h2>
    <p>Artificial intelligence, machine learning, and their applications.</p>
  </div>
  
  <div class="category-item">
    <h2><a href="{{ '/categories/development/' | relative_url }}">Development</a></h2>
    <p>Programming, software development, and technical projects.</p>
  </div>
</div>

<style>
  .category-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }
  
  .category-item {
    padding: 1.5rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background-color: var(--light-gray);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .category-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .category-item h2 {
    margin-top: 0;
  }
  
  .category-item a {
    color: var(--primary-color);
    text-decoration: none;
  }
  
  .category-item p {
    margin-bottom: 0;
  }
</style> 