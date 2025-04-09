const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Define directories
const postsDir = path.join(__dirname, '_posts');
const contentPostsDir = path.join(__dirname, 'content', 'posts');

// Ensure content directory exists
if (!fs.existsSync(contentPostsDir)) {
  fs.mkdirSync(contentPostsDir, { recursive: true });
}

// Function to migrate posts
const migratePosts = () => {
  const postFiles = fs.readdirSync(postsDir);
  postFiles.forEach((file) => {
    const filePath = path.join(postsDir, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    // Ensure categories is an array
    const categories = Array.isArray(data.categories) 
      ? data.categories 
      : data.categories.split(' ').map(cat => cat.trim());

    // Reconstruct front matter with array categories
    const updatedFrontMatter = {
      ...data,
      categories: categories
    };

    // Convert back to a markdown file with updated front matter
    const updatedFileContents = matter.stringify(content, updatedFrontMatter);

    const newFilePath = path.join(contentPostsDir, file);
    fs.writeFileSync(newFilePath, updatedFileContents);
    console.log(`Migrated post: ${file}`);
  });
};

// Run migration
migratePosts();