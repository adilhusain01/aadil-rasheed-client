"use client";

import { useEffect, useState } from "react";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";
import BlogCard from "@/components/blog/BlogCard";
import { fetchBlogPosts } from "@/lib/api";
import type { BlogPost } from "@/lib/api";

export default function BlogPageClient() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogPosts() {
      try {
        setLoading(true);
        const posts = await fetchBlogPosts();
        setBlogPosts(posts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
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
              <div className="py-8 animate-pulse flex justify-center items-center min-h-[200px]">
                <p className="text-lg text-gray-500">Loading blog posts...</p>
              </div>
            ) : blogPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-12">
                {blogPosts.map((post: BlogPost) => (
                  <BlogCard 
                    key={post._id} 
                    post={post} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl text-gray-600">No blog posts available at the moment.</h3>
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>
    </PageTransition>
  );
}
