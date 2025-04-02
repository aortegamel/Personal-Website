async function loadProjects() {
  try {
    console.log('Attempting to fetch projects.json');
    console.log('Current URL:', window.location.href);
    console.log('Fetch URL:', '/assets/projects.json');
    
    const response = await fetch('/assets/projects.json');
    console.log('Fetch response:', response);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const projects = await response.json();
    console.log('Fetched projects:', projects);
    
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
      
      // Special handling for BluefinAI Agent Trader project
      const isBluefinProject = project.name.includes('BluefinAI Agent Trader');
      
      if (isBluefinProject) {
        console.warn('Detected BluefinAI Agent Trader project with potential loading issue');
      }
      
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
      
      if (isBluefinProject) {
        card.classList.add('bluefin-project');
        console.log('Added bluefin-project class to card');
      }
      
      projectsGrid.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading projects:', error);
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid) {
      projectsGrid.innerHTML = `
        <p>Error loading projects. Please try again later.</p>
        <p>Debug Info:</p>
        <pre>${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}</pre>
      `;
    }
  }
}

document.addEventListener('DOMContentLoaded', loadProjects);