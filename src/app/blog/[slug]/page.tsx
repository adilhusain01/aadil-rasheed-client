import { Suspense } from 'react';
import BlogPostClient from './client';
import { fetchBlogPosts, type BlogPost } from "@/lib/api";
import { notFound } from 'next/navigation';

// Export the BlogPost type for components that need it
export type { BlogPost };

// Generate static paths for all blog posts at build time
export async function generateStaticParams() {
  try {
    console.log('Generating static params for blog posts');
    
    // Fetch dynamic slugs from API
    const posts = await fetchBlogPosts();
    const slugs = posts.map((post) => ({
      slug: post.slug,
    }));
    
    console.log(`Generated params for ${slugs.length} blog posts`);
    console.log('Slugs being pre-rendered:', slugs.map(s => s.slug).join(', '));
    return slugs;
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return empty array - dynamic paths will be generated on demand
    return [];
  }
}

// Set revalidation interval
export const revalidate = 3600; // Revalidate pages every hour

// CRITICAL: Enable dynamic rendering for slugs not in generateStaticParams
// This ensures that non-hardcoded slugs will still be rendered on-demand
export const dynamicParams = true;

// This ensures fallback behavior works correctly on Vercel
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// This is the main page component wrapper
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  // Log the slug to help with debugging
  console.log(`[Blog Post Page] Received slug: '${slug}'`);
  
  // Only do minimal validation to prevent obviously invalid slugs
  if (!slug || typeof slug !== 'string' || slug.length < 1) {
    console.error(`[Blog Post Page] Invalid slug detected: '${slug}'`);
    return notFound();
  }
  
  return (
    <Suspense fallback={<div className="mt-[5rem] px-4 flex justify-center items-center min-h-[50vh]">Loading...</div>}>
      <BlogPostClient slug={slug} />
    </Suspense>
  );
}


