import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/mdx';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const posts = getAllPosts();
  const post = posts.find(p => p.slug === params.slug);

  if (!post) {
    return new NextResponse(null, { status: 404 });
  }

  // Placeholder for PDF generation
  return new NextResponse(
    JSON.stringify({ 
      message: 'PDF generation is currently disabled', 
      post: post 
    }), 
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    }
  );
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}
