const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Define the projects directory
const projectsDir = path.join(__dirname, '_projects');
const contentProjectsDir = path.join(__dirname, 'content', 'projects');

// Ensure content directory exists
if (!fs.existsSync(contentProjectsDir)) {
  fs.mkdirSync(contentProjectsDir, { recursive: true });
}

// Function to convert project files
const convertProjects = () => {
  const projectFiles = fs.readdirSync(projectsDir);
  projectFiles.forEach((file) => {
    const filePath = path.join(projectsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Parse YAML content
    const projectData = yaml.load(content);

    // Ensure features is an array
    if (!projectData.features) {
      projectData.features = ["No features listed"];
    }

    // Convert to Markdown front matter
    const frontMatter = yaml.dump({
      name: projectData.name,
      description: projectData.description,
      tech_stack: projectData.tech_stack,
      github: projectData.github,
      private_full_version: projectData.private_full_version,
      has_demo: projectData.has_demo,
      contact: projectData.contact,
      features: projectData.features
    }).trim();

    // Combine front matter and detailed description
    const newProject = `---
${frontMatter}
---

${projectData.detailed_description || ''}
`;

    const newFilePath = path.join(contentProjectsDir, file.replace('.yml', '.md'));
    fs.writeFileSync(newFilePath, newProject);
    console.log(`Converted project: ${file}`);
  });
};

// Run conversion
convertProjects();