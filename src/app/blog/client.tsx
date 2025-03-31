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
        console.log("[Blog Page] Loading blog posts");
        setLoading(true);
        const posts = await fetchBlogPosts();
        console.log(`[Blog Page] Got ${posts.length} posts`);
        setBlogPosts(posts);
      } catch (error) {
        console.error("[Blog Page] Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    }

    loadBlogPosts();
  }, []);

  return (
    <PageTransition>
      <section className="mt-[5rem] px-4">
        <div className="container mx-auto">
          <AnimatedSection>
            <h1 className="text-4xl font-bold mb-8">Blog</h1>
          </AnimatedSection>

          <AnimatedSection>
            <div className="my-8">
            {loading ? (
              <div className="animate-pulse">Loading blog posts...</div>
            ) : blogPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post: BlogPost) => (
                  <BlogCard 
                    key={post._id} 
                    post={post} 
                  />
                ))}
              </div>
            ) : (
              <AnimatedSection className="text-center py-16">
                <h3 className="text-xl text-gray-600">No blog posts available at the moment.</h3>
              </AnimatedSection>
            )}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageTransition>
  );
}
