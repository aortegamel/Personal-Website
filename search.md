---
layout: page
title: Search
permalink: /search/
---

<div id="search-container">
  <input type="text" id="search-input" placeholder="Search articles...">
  <div id="results-container"></div>
</div>

<script src="https://unpkg.com/simple-jekyll-search@latest/dest/simple-jekyll-search.min.js"></script>
<script>
  SimpleJekyllSearch({
    searchInput: document.getElementById('search-input'),
    resultsContainer: document.getElementById('results-container'),
    json: '{{ "/search.json" | relative_url }}',
    searchResultTemplate: '<div class="search-result"><a href="{url}">{title}</a><p>{excerpt}</p></div>',
    noResultsText: 'No results found',
    limit: 10,
    fuzzy: false
  });
</script>

<style>
  #search-container {
    max-width: 100%;
    padding: 20px 0;
  }
  
  #search-input {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
    border: 2px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }
  
  .search-result {
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  
  .search-result a {
    font-size: 1.2em;
    text-decoration: none;
    font-weight: bold;
  }
  
  .search-result p {
    margin-top: 5px;
    color: #333;
  }
</style> 