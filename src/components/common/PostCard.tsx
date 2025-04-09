'use client';

import React from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    date: string;
    excerpt?: string;
    categories?: string[];
    url: string;
  };
  variant?: 'default' | 'compact' | 'featured';
}

export function PostCard({ post, variant = 'default' }: PostCardProps) {
  const { title, date, excerpt, categories, url } = post;
  const formattedDate = formatDate(date);
  
  if (variant === 'compact') {
    return (
      <article className="border-b border-abyss-700/30 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
        <h3 className="text-lg font-bold mb-1 font-montserrat">
          <Link href={url} className="abyss-link">
            {title}
          </Link>
        </h3>
        <p className="text-abyss-200 text-sm">{formattedDate}</p>
      </article>
    );
  }
  
  if (variant === 'featured') {
    return (
      <Card hover="glow" variant="highlight" className="h-full">
        <CardHeader>
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.map((category) => (
                <Badge key={category} variant="category">
                  {category}
                </Badge>
              ))}
            </div>
          )}
          <CardTitle>
            <Link href={url} className="abyss-link">
              {title}
            </Link>
          </CardTitle>
          <p className="text-abyss-200 text-sm">{formattedDate}</p>
        </CardHeader>
        <CardContent>
          {excerpt && <p className="text-abyss-100">{excerpt}</p>}
        </CardContent>
        <CardFooter>
          <Link href={url} className="abyss-link inline-flex items-center">
            Read more
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </CardFooter>
      </Card>
    );
  }
  
  // Default variant
  return (
    <Card hover="border" className="h-full">
      <CardHeader>
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map((category) => (
              <Badge key={category} variant="category">
                {category}
              </Badge>
            ))}
          </div>
        )}
        <CardTitle>
          <Link href={url} className="abyss-link">
            {title}
          </Link>
        </CardTitle>
        <p className="text-abyss-200 text-sm">{formattedDate}</p>
      </CardHeader>
      <CardContent>
        {excerpt && <p className="text-abyss-100">{excerpt}</p>}
      </CardContent>
      <CardFooter>
        <Link href={url} className="abyss-link inline-flex items-center">
          Read more
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </CardFooter>
    </Card>
  );
}
