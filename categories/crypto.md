---
layout: page
title: Crypto Articles
permalink: /categories/crypto/
---

# Crypto Articles

Blockchain technology, cryptocurrency analysis, and DeFi innovations.

<div class="post-list">
  {% for post in site.posts %}
    {% if post.categories contains "crypto" %}
      <div class="post-preview">
        <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
        <p class="post-meta">{{ post.date | date: "%B %d, %Y" }}</p>
        <p>{{ post.excerpt }}</p>
        <a href="{{ post.url | relative_url }}">Read more</a>
      </div>
      <hr>
    {% endif %}
  {% endfor %}
</div>

{% if site.posts.size == 0 or site.posts | where_exp: "post", "post.categories contains 'crypto'" | size == 0 %}
  <p>No articles in this category yet. Check back soon!</p>
{% endif %} 