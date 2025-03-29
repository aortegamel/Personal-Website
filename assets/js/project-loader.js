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
    
    // Add disclaimer notice at the top
    const disclaimer = document.createElement('div');
    disclaimer.className = 'disclaimer-notice';
    disclaimer.innerHTML = `
      <p><strong>Note:</strong> All code examples shown are simplified placeholders. 
      For access to the real projects or more information, please <a href="mailto:arainey555@gmail.com">contact me</a>.</p>
    `;
    projectsGrid.appendChild(disclaimer);
    
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
          ${project.github ? `<a href="${project.github}" target="_blank" class="github-link">View Code</a>` : ''}
          ${project.demo ? `<a href="${project.demo}" target="_blank" class="demo-link">Live Demo</a>` : ''}
          ${project.private_full_version ? `<a href="mailto:${project.contact || 'arainey555@gmail.com'}" class="contact-link">Contact for Full Version</a>` : ''}
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