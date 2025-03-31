import { Suspense } from 'react';
import BlogPostClient from './client';
import { fetchBlogPosts, fetchBlogPostBySlug, type BlogPost } from "@/lib/api";

// Export the BlogPost type for components that need it
export type { BlogPost };

// Important: These settings configure how Next.js handles this dynamic route
export const dynamicParams = true; // Allow slugs not listed in generateStaticParams
export const revalidate = 3600; // Revalidate at most once per hour
export const fetchCache = 'force-no-store'; // Don't cache fetch requests
export const runtime = 'nodejs'; // Use Node.js runtime

// This function tells Next.js which routes to pre-generate at build time
export async function generateStaticParams() {
  try {
    console.log('[Blog Post Page] Generating static params for blog posts');
    
    // Always include important hardcoded slugs
    const hardcodedSlugs = [
      { slug: 'ham-pe-laazim-hai-ki-ham-waqt-ko-zaaya-na-karein' },
      // Add more critical slugs here
    ];
    
    // Try to fetch dynamic slugs from API
    let dynamicSlugs: { slug: string }[] = [];
    try {
      const posts = await fetchBlogPosts();
      dynamicSlugs = posts.map((post) => ({
        slug: post.slug,
      }));
      console.log(`[Blog Post Page] Successfully fetched ${dynamicSlugs.length} dynamic slugs`);
    } catch (error) {
      console.error('[Blog Post Page] Error fetching dynamic slugs:', error);
    }
    
    // Combine hardcoded and dynamic slugs (avoiding duplicates)
    const allSlugs = [...hardcodedSlugs];
    dynamicSlugs.forEach(item => {
      if (!allSlugs.some(existing => existing.slug === item.slug)) {
        allSlugs.push(item);
      }
    });
    
    console.log(`[Blog Post Page] Generated params for ${allSlugs.length} blog posts`);
    return allSlugs;
  } catch (error) {
    console.error('[Blog Post Page] Error in generateStaticParams:', error);
    return [
      { slug: 'ham-pe-laazim-hai-ki-ham-waqt-ko-zaaya-na-karein' },
    ];
  }
}

// The server component for blog post pages
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  // Optional: Pre-fetch the post on the server to improve initial load
  // This doesn't replace client-side fetching but can improve performance
  try {
    // Attempt to pre-fetch the post data (but don't block rendering on it)
    await fetchBlogPostBySlug(slug);
    console.log(`[Blog Post Page] Pre-fetched data for slug: ${slug}`);
  } catch (error) {
    // Just log the error, we'll handle actual rendering in the client component
    console.error(`[Blog Post Page] Error pre-fetching data for slug: ${slug}`, error);
  }
  
  return (
    <Suspense fallback={<div className="mt-[5rem] px-4 flex justify-center items-center min-h-[50vh]">
      <div className="animate-pulse">Loading post...</div>
    </div>}>
      <BlogPostClient slug={slug} />
    </Suspense>
  );
}
