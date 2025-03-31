import BlogPageClient from './client'

// Set revalidation interval
export const revalidate = 3600; // Revalidate every hour

// This allows the blog index page to be statically generated
// with fresh data at build time, and revalidated periodically
export default function BlogPage() {
  return <BlogPageClient />;
}


