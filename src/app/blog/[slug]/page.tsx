import { Suspense } from 'react';
import BlogPostClient from './client';
import { fetchBlogPosts, type BlogPost } from "@/lib/api";
import { notFound } from 'next/navigation';

export const revalidate = 3600; // Revalidate pages every hour

// IMPORTANT: Enable dynamic parameters to handle slugs not in generateStaticParams
export const dynamicParams = true;

// Export the BlogPost type for components that need it
export type { BlogPost };

// Generate static paths for all blog posts at build time
// export async function generateStaticParams() {
//   try {
//     console.log('Generating static params for blog posts');
//     // Include hardcoded slugs for critical blog posts to ensure they're pre-rendered
//     const hardcodedSlugs = [
//       { slug: 'ham-pe-laazim-hai-ki-ham-waqt-ko-zaaya-na-karein' },
//       { slug: 'cgdg' }, // Adding your example slug
//       // A few more examples of potential slugs with different patterns
//       { slug: 'my-blog-post' },
//       { slug: 'special_characters' },
//       { slug: 'with.dots' },
//       { slug: 'numbers123' },
//       // Add any other important slugs that must be pre-rendered
//     ];
    
//     // Fetch dynamic slugs from API
//     const posts = await fetchBlogPosts();
//     const dynamicSlugs = posts.map((post) => ({
//       slug: post.slug,
//     }));
    
//     // Combine both sets of slugs, ensuring no duplicates
//     const allSlugs = [...hardcodedSlugs];
    
//     // Add dynamic slugs that aren't already in the hardcoded list
//     dynamicSlugs.forEach(item => {
//       if (!allSlugs.some(existing => existing.slug === item.slug)) {
//         allSlugs.push(item);
//       }
//     });
    
//     console.log(`Generated params for ${allSlugs.length} blog posts`);
//     console.log('Slugs being pre-rendered:', allSlugs.map(s => s.slug).join(', '));
//     return allSlugs;
//   } catch (error) {
//     console.error('Error generating static params:', error);
//     // Always return at least the hardcoded slugs even if API fails
//     return [
//       { slug: 'ham-pe-laazim-hai-ki-ham-waqt-ko-zaaya-na-karein' },
//       { slug: 'cgdg' }, // Your example slug
//       { slug: 'my-blog-post' },
//       { slug: 'special_characters' },
//       { slug: 'with.dots' },
//       { slug: 'numbers123' },
//     ];
//   }
// }

export async function generateStaticParams() {
  try {
    console.log('Generating static params for blog posts');
    
    // Include hardcoded slugs for critical blog posts
    const hardcodedSlugs = [
      { slug: 'ham-pe-laazim-hai-ki-ham-waqt-ko-zaaya-na-karein' },
      // Add any other important slugs
    ];
    
    // Fetch any additional dynamic slugs from API
    let dynamicSlugs: { slug: string }[] = [];
    try {
      const posts = await fetchBlogPosts();
      dynamicSlugs = posts.map((post) => ({
        slug: post.slug,
      }));
    } catch (error) {
      console.error('Error fetching dynamic slugs:', error);
      // Continue with hardcoded slugs if API fails
    }
    
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
    // Return at least the hardcoded slugs if anything fails
    return [
      { slug: 'ham-pe-laazim-hai-ki-ham-waqt-ko-zaaya-na-karein' },
    ];
  }
}

// Set revalidation interval
// export const revalidate = 3600; // Revalidate pages every hour

// CRITICAL: Enable dynamic rendering for slugs not in generateStaticParams
// This ensures that non-hardcoded slugs will still be rendered on-demand
// export const dynamicParams = true;

// This ensures fallback behavior works correctly on Vercel
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// This is the main page component wrapper
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  // No need for server-side validation or notFound() here
  // Let the client component handle the display with fallback content
  
  return (
    <Suspense fallback={<div className="mt-[5rem] px-4 flex justify-center items-center min-h-[50vh]">Loading...</div>}>
      <BlogPostClient slug={slug} />
    </Suspense>
  );
}
