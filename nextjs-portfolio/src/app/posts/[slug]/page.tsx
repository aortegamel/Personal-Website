import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx'));
  return files.map(filename => ({ slug: filename.replace(/\.mdx$/, '') }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const filePath = path.join(process.cwd(), 'content', 'posts', `${params.slug}.mdx`);
  if (!fs.existsSync(filePath)) return notFound();
  const source = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(source);

  return (
    <main className="prose mx-auto py-12">
      <h1>{data.title}</h1>
      <p className="text-zinc-400 mb-4">{data.date}</p>
      <MDXRemote source={content} />
    </main>
  );
}
