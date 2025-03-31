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
    // Include hardcoded slugs for critical blog posts to ensure they're pre-rendered
    const hardcodedSlugs = [
      { slug: 'ham-pe-laazim-hai-ki-ham-waqt-ko-zaaya-na-karein' },
      // Add any other important slugs that must be pre-rendered
    ];
    
    // Fetch dynamic slugs from API
    const posts = await fetchBlogPosts();
    const dynamicSlugs = posts.map((post) => ({
      slug: post.slug,
    }));
    
    // Combine both sets of slugs, ensuring no duplicates
    const allSlugs = [...hardcodedSlugs];
    
    // Add dynamic slugs that aren't already in the hardcoded list
    dynamicSlugs.forEach(item => {
      if (!allSlugs.some(existing => existing.slug === item.slug)) {
        allSlugs.push(item);
      }
    });
    
    console.log(`Generated params for ${allSlugs.length} blog posts`);
    return allSlugs;
  } catch (error) {
    console.error('Error generating static params:', error);
    // Always return at least the hardcoded slugs even if API fails
    return [
      { slug: 'ham-pe-laazim-hai-ki-ham-waqt-ko-zaaya-na-karein' },
      // Add any other critical slugs
    ];
  }
}

// Set revalidation interval
export const revalidate = 3600; // Revalidate pages every hour
// Enable dynamic rendering for slugs not in generateStaticParams
export const dynamicParams = true;

// This is the main page component wrapper
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  // Validate slug format to prevent 404s caused by invalid slugs
  if (!slug || typeof slug !== 'string' || !slug.match(/^[a-zA-Z0-9-]+$/)) {
    return notFound();
  }
  
  return (
    <Suspense fallback={<div className="mt-[5rem] px-4 flex justify-center items-center min-h-[50vh]">Loading...</div>}>
      <BlogPostClient slug={slug} />
    </Suspense>
  );
}


