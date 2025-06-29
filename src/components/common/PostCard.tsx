'use client';

import React from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { renderCategories, createVariantRenderer } from '@/lib/ui-utils';

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  categories?: string[];
  url: string;
}

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'compact' | 'featured';
}

// Pure function for arrow icon
const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

// Pure function for post header
const PostHeader = ({ 
  title, 
  url, 
  date, 
  categories 
}: { 
  title: string; 
  url: string; 
  date: string; 
  categories?: string[];
}) => (
  <>
    {categories && categories.length > 0 && (
      <div className="flex flex-wrap gap-2 mb-3">
        {renderCategories(categories)}
      </div>
    )}
    <CardTitle>
      <Link href={url} className="abyss-link">
        {title}
      </Link>
    </CardTitle>
    <p className="text-abyss-200 text-sm">{formatDate(date)}</p>
  </>
);

// Pure function for read more link
const ReadMoreLink = ({ url }: { url: string }) => (
  <Link href={url} className="abyss-link inline-flex items-center">
    Read more
    <ArrowIcon />
  </Link>
);

// Variant renderers as pure functions
const CompactPostCard = ({ post }: { post: Post }) => (
  <article className="border-b border-abyss-700/30 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
    <h3 className="text-lg font-bold mb-1 font-montserrat">
      <Link href={post.url} className="abyss-link">
        {post.title}
      </Link>
    </h3>
    <p className="text-abyss-200 text-sm">{formatDate(post.date)}</p>
  </article>
);

const FeaturedPostCard = ({ post }: { post: Post }) => (
  <Card hover="glow" variant="highlight" className="h-full">
    <CardHeader>
      <PostHeader 
        title={post.title} 
        url={post.url} 
        date={post.date} 
        categories={post.categories} 
      />
    </CardHeader>
    <CardContent>
      {post.excerpt && <p className="text-abyss-100">{post.excerpt}</p>}
    </CardContent>
    <CardFooter>
      <ReadMoreLink url={post.url} />
    </CardFooter>
  </Card>
);

const DefaultPostCard = ({ post }: { post: Post }) => (
  <Card hover="border" className="h-full">
    <CardHeader>
      <PostHeader 
        title={post.title} 
        url={post.url} 
        date={post.date} 
        categories={post.categories} 
      />
    </CardHeader>
    <CardContent>
      {post.excerpt && <p className="text-abyss-100">{post.excerpt}</p>}
    </CardContent>
    <CardFooter>
      <ReadMoreLink url={post.url} />
    </CardFooter>
  </Card>
);

// Create the variant renderer
const renderPostCard = createVariantRenderer<{ post: Post }, 'default' | 'compact' | 'featured'>({
  compact: CompactPostCard,
  featured: FeaturedPostCard,
  default: DefaultPostCard,
}, 'default');

// Main component is now just a wrapper
export function PostCard({ post, variant = 'default' }: PostCardProps) {
  return renderPostCard({ post, variant });
}