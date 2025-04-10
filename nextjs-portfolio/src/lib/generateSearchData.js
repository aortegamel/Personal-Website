import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Paths
const postsDirectory = path.join(process.cwd(), 'src/content/posts');
const projectsDirectory = path.join(process.cwd(), 'src/content/projects');
const outputPath = path.join(process.cwd(), 'public/search.json');

// Generate search data
function generateSearchData() {
  let searchData = [];

  // Process posts
  if (fs.existsSync(postsDirectory)) {
    const postFiles = fs.readdirSync(postsDirectory);

    const postsData = postFiles.map(filename => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      // Format date
      let formattedDate = '';
      if (data.date) {
        const date = new Date(data.date);
        formattedDate = date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      }

      // Create excerpt
      const excerpt = data.excerpt || content.slice(0, 160).replace(/\n/g, ' ');

      return {
        title: data.title || '',
        url: `/posts/${filename.replace(/\.md$/, '')}`,
        date: formattedDate,
        category: Array.isArray(data.categories) ? data.categories.join(', ') : data.categories || '',
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '',
        excerpt: excerpt,
        type: 'post'
      };
    });

    searchData = [...searchData, ...postsData];
  } else {
    console.log('Posts directory does not exist. Creating it...');
    fs.mkdirSync(postsDirectory, { recursive: true });
  }

  // Process projects
  if (fs.existsSync(projectsDirectory)) {
    const projectFiles = fs.readdirSync(projectsDirectory);

    const projectsData = projectFiles.map(filename => {
      const filePath = path.join(projectsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      // Create description
      const description = data.description || content.slice(0, 160).replace(/\n/g, ' ');

      return {
        title: data.name || data.title || '',
        url: `/projects/${filename.replace(/\.md$/, '')}`,
        description: description,
        tech_stack: Array.isArray(data.tech_stack) ? data.tech_stack.join(', ') : data.tech_stack || '',
        features: Array.isArray(data.features) ? data.features.join(', ') : data.features || '',
        type: 'project'
      };
    });

    searchData = [...searchData, ...projectsData];
  } else {
    console.log('Projects directory does not exist. Creating it...');
    fs.mkdirSync(projectsDirectory, { recursive: true });
  }

  return searchData;
}

// Write search data to file
function writeSearchData() {
  const searchData = generateSearchData();

  // Ensure public directory exists
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(searchData, null, 2));
  console.log(`Search data written to ${outputPath}`);
}

// Execute
writeSearchData();
