---
layout: home
title: Welcome to My Portfolio
---

# Hello, I'm Angel Ortega-Melton

I'm a developer passionate about creating innovative solutions. This portfolio showcases my projects and articles on various technical topics.

## Latest Projects

<div class="disclaimer-notice">
  <p><strong>Note:</strong> All code examples shown are simplified placeholders. 
  For access to the real projects or more information, please <a href="mailto:arainey555@gmail.com">contact me</a>.</p>
</div>

<div id="projects-grid" class="project-grid">
  <!-- Projects will be loaded here dynamically -->
</div>

## Recent Articles

{% for post in site.posts limit:3 %}
  <div class="post-preview">
    <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
    <p class="post-meta">{{ post.date | date: "%B %d, %Y" }}</p>
    <p>{{ post.excerpt }}</p>
    <a href="{{ post.url | relative_url }}">Read more</a>
  </div>
{% endfor %}

<script src="{{ '/assets/js/project-loader.js' | relative_url }}"></script> 