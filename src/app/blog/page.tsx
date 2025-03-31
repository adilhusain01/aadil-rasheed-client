"use client";

import { useEffect, useState } from "react";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";
import BlogCard from "@/components/blog/BlogCard";
import { fetchBlogPosts } from "@/lib/api";

// Blog Post type
export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  date: string;
  likes?: number;
  isPublished: boolean;
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogPosts() {
      try {
        console.log("[Blog Page] Loading blog posts");
        setLoading(true);
        const posts = await fetchBlogPosts();
        console.log(`[Blog Page] Loaded ${posts.length} blog posts`);
        setBlogPosts(posts);
      } catch (error) {
        console.error('[Blog Page] Error loading blog posts:', error);
      } finally {
        setLoading(false);
      }
    }

    loadBlogPosts();
  }, []);

  return (
    <PageTransition>
      <section className="mt-[5rem] px-4">
        <div className="w-full max-w-5xl mx-auto">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-serif mb-12">Blog Posts</h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            {loading ? (
              <div className="py-12 text-center">
                <p className="text-gray-600">Loading blog posts...</p>
              </div>
            ) : blogPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-12">
                {blogPosts.map((post: BlogPost) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-600">No blog posts found. Check back soon for new content!</p>
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>
    </PageTransition>
  );
}
