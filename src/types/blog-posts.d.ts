// Provided by the blogPosts plugin in vite.config.ts: published posts only.
declare module 'virtual:blog-posts' {
  const posts: import('@/types/content').Post[]
  export default posts
}
