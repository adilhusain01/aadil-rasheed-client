import { Suspense } from 'react';
import BlogPostClient from './client';
import { fetchBlogPosts } from "@/lib/api";

// Generate static paths for all blog posts at build time
export async function generateStaticParams() {
  try {
    console.log('Generating static params for blog posts');
    const posts = await fetchBlogPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Set revalidation interval
export const revalidate = 3600; // Revalidate pages every hour

// This is the main page component wrapper
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  return (
    <Suspense fallback={<div className="mt-[5rem] px-4 flex justify-center items-center min-h-[50vh]">Loading...</div>}>
      <BlogPostClient slug={slug} />
    </Suspense>
  );
}


