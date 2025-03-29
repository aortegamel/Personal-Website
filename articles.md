---
layout: page
title: Articles
permalink: /articles/
---

# My Thoughts & Journey

This is where I write my opinion pieces as well as personal stories and journey. A glimpse into my mind and experiences as I navigate through life and technology.

{% for post in site.posts %}
  <div class="post-preview">
    <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
    <p class="post-meta">{{ post.date | date: "%B %d, %Y" }} | 
      {% for category in post.categories %}
        <span class="category">{{ category }}</span>
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