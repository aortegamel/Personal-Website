import { loadPosts } from '@/lib/content-loader';
import SearchClient from './search-client';

export default function SearchPage() {
  const allPosts = loadPosts();

  return <SearchClient posts={allPosts} />;
}
