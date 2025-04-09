const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Paths
const postsDirectory = path.join(process.cwd(), 'src/content/posts');
const outputPath = path.join(process.cwd(), 'public/search.json');

// Generate search data
function generateSearchData() {
  // Ensure posts directory exists
  if (!fs.existsSync(postsDirectory)) {
    console.log('Posts directory does not exist. Creating it...');
    fs.mkdirSync(postsDirectory, { recursive: true });
    return [];
  }

  const postFiles = fs.readdirSync(postsDirectory);
  
  const searchData = postFiles.map(filename => {
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
      excerpt: excerpt
    };
  });
  
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
