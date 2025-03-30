"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/app/blog/[slug]/page"; // Using the interface from the blog post page
import AnimatedSection from "@/components/AnimatedSection";
import { fetchBlogPosts } from "@/lib/api";

interface RelatedPostsProps {
  currentPost: BlogPost;
}

export default function RelatedPosts({ currentPost }: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  
  useEffect(() => {
    const getRelatedPosts = async () => {
      try {
        const allPosts = await fetchBlogPosts();
        const filtered = allPosts
          .filter((p: BlogPost) => p.slug !== currentPost.slug)
          .slice(0, 3);
        setRelatedPosts(filtered);
      } catch (error) {
        console.error('Error fetching related posts:', error);
      }
    };
    
    getRelatedPosts();
  }, [currentPost.slug]);

  return (
    <AnimatedSection delay={0.4}>
      <div className="border-t border-gray-200 py-10 mt-10">
        <h3 className="text-xl font-serif mb-6">Related Posts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedPosts.map((post, index) => (
            <div key={index} className="group">
              <Link href={`/blog/${post.slug}`}>
                <div className="relative h-[200px] w-full mb-3 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h4 className="text-md font-serif hover:text-primary transition-colors">
                  {post.title}
                </h4>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
