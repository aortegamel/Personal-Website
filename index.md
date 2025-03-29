---
layout: home
title: Welcome to My Portfolio
---

# Hello, I'm Angel Ortega-Melton

I'm a new aspiring programmer leveraging AI tools to accelerate learning and project building. With experience in Python, JavaScript, and web development fundamentals, I focus on creating innovative solutions with modern technologies. I have a strong background in customer service and operational logistics with proven ability to adapt to different environments and learn new skills quickly. I'm seeking opportunities to combine my technical learning journey and customer-focused background in a software development role.

This portfolio showcases my projects and articles on various technical topics, with a particular focus on blockchain development, AI integration, and efficient system design.

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