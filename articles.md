---
layout: page
title: Articles
permalink: /articles/
---

# My Thoughts & Journey

This is where I write my opinion pieces as well as personal stories and journey. A glimpse into my mind and experiences as I navigate through life and technology.

<div class="category-filters">
  <h3>Browse by Category:</h3>
  <div class="filter-buttons">
    <a href="{{ '/categories/economics/' | relative_url }}" class="filter-btn">Economics</a>
    <a href="{{ '/categories/crypto/' | relative_url }}" class="filter-btn">Crypto</a>
    <a href="{{ '/categories/personal/' | relative_url }}" class="filter-btn">Personal</a>
    <a href="{{ '/categories/ai/' | relative_url }}" class="filter-btn">AI</a>
    <a href="{{ '/categories/development/' | relative_url }}" class="filter-btn">Development</a>
  </div>
</div>

{% for post in site.posts %}
  <div class="post-preview">
    <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
    <p class="post-meta">{{ post.date | date: "%B %d, %Y" }} | 
      {% for category in post.categories %}
        <a href="{{ '/categories/' | append: category | append: '/' | relative_url }}" class="category">{{ category }}</a>
      {% endfor %}
    </p>
    <p>{{ post.excerpt }}</p>
    <div class="tags">
      {% for tag in post.tags %}
        <span class="tag">{{ tag }}</span>
      {% endfor %}
    </div>
    <a href="{{ post.url | relative_url }}">Read more</a>
  </div>
  <hr>
{% endfor %}

<style>
  .category-filters {
    margin: 2rem 0;
    padding: 1rem;
    background-color: var(--light-gray);
    border-radius: 6px;
  }
  
  .filter-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .filter-btn {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    background-color: var(--primary-color);
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .filter-btn:hover {
    background-color: #0353a8;
    text-decoration: none;
  }
  
  .category {
    color: var(--primary-color);
    font-weight: 500;
    text-decoration: none;
    margin-right: 0.5rem;
  }
  
  .category:hover {
    text-decoration: underline;
  }
</style> 