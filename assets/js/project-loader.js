async function loadProjects() {
  try {
    const response = await fetch('/assets/data/projects.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const projects = await response.json();
    
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) {
      console.error('Projects grid container not found');
      return;
    }
    
    projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <div class="tech-stack">
          ${project.tech_stack.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
        <div class="project-features">
          <h4>Key Features:</h4>
          <ul>
            ${project.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
        <div class="project-links">
          <a href="${project.github}" target="_blank" class="github-link">View Code</a>
          ${project.demo ? `<a href="${project.demo}" target="_blank" class="demo-link">Live Demo</a>` : ''}
        </div>
      `;
      projectsGrid.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading projects:', error);
    document.getElementById('projects-grid').innerHTML = '<p>Error loading projects. Please try again later.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadProjects); 