import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface MdxPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
}

export function getAllMdxPosts(): MdxPostMeta[] {
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx'));
  return files.map(filename => {
    const filePath = path.join(postsDir, filename);
    const source = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(source);
    return {
      slug: filename.replace(/\.mdx$/, ''),
      title: data.title || filename,
      date: data.date || '',
      excerpt: data.excerpt || '',
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
