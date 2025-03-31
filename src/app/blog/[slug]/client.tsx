"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";
import RelatedPosts from "@/components/blog/RelatedPosts";
import CommentSection from "@/components/blog/CommentSection";
import { fetchBlogPostBySlug, likeBlogPost } from "@/lib/api";
import type { BlogPost } from "@/lib/api";

export default function BlogPostClient({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liking, setLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    // Check if user has already liked this post
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    if (post && likedPosts.includes(post._id)) {
      setHasLiked(true);
    }
  }, [post]);

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);
        // Implement retry logic for client-side fetching
        const maxRetries = 3;
        let retryCount = 0;
        let success = false;
        
        while (!success && retryCount < maxRetries) {
          try {
            const fetchedPost = await fetchBlogPostBySlug(slug);
            setPost(fetchedPost);
            success = true;
          } catch (fetchError) {
            retryCount++;
            
            if (retryCount < maxRetries) {
              // Wait before retrying with exponential backoff
              await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 500));
            } else {
              throw fetchError; // Re-throw if all retries failed
            }
          }
        }
      } catch (err) {
        setError('Failed to load blog post. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    }
    
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const handleLike = async () => {
    if (!post || liking || hasLiked) return;
    
    try {
      setLiking(true);
      const updatedPost = await likeBlogPost(post._id);
      
      // Update post with new like count
      setPost({
        ...post,
        likes: updatedPost.likes
      });
      
      // Save liked state to localStorage
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      likedPosts.push(post._id);
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
      
      setHasLiked(true);
    } catch (err) {
      console.error('Error liking post:', err);
    } finally {
      setLiking(false);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="mt-[5rem] px-4 flex justify-center items-center min-h-[50vh]">
          <div className="animate-pulse">Loading post: {slug}...</div>
        </div>
      </PageTransition>
    );
  }

  if (error || !post) {
    return (
      <PageTransition>
        <div className="mt-[5rem] px-4 flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{error ? 'Error Loading Post' : 'Post Not Available'}</h2>
            <p className="text-red-500 mb-4">{error || 'We couldn\'t find the blog post you\'re looking for.'}</p>
            <div className="mt-6 flex justify-center space-x-4">
              <Link href="/blog" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-all">
                Browse All Posts
              </Link>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <section className="mt-[5rem] px-4">
        <div className="w-full max-w-5xl mx-auto py-4">
          {/* Back Link */}
          <Link href="/blog" className="hover:text-primary transition-colors flex items-center gap-1 mb-8">
            <span className="transform transition-transform group-hover:-translate-x-1">←</span> 
            <span>All posts</span>
          </Link>
        </div>
        
        <div className="w-full max-w-5xl mx-auto px-4 py-12 border-[1px] rounded-lg">
          <article className="w-full max-w-3xl mx-auto">
          
            {/* Title Section */}
            <AnimatedSection>
              <header className="mb-10">
                <div className="flex items-center justify-start space-x-3 mb-8">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                    A
                  </div>
                  <div className="flex flex-row items-center justify-start gap-2">
                    <span className="text-sm font-medium">Admin</span>
                    <div className="text-xs text-muted-foreground space-x-1">
                      <span>•</span>
                      <span>{new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">{post.title}</h1>
                  {post.excerpt && <p className="font-semibold">{post.excerpt}</p>}
                </div>
          
                {/* Featured Image */}
                {post.image && (
                  <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
                    <Image 
                      src={post.image} 
                      alt={post.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}
          
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>
            </AnimatedSection>
          
            {/* Content */}
            <AnimatedSection delay={0.2}>
              <div className="prose prose-stone max-w-none mb-10 space-y-5">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </AnimatedSection>
            
            {/* Actions */}
            <AnimatedSection delay={0.3}>
              <div className="border-t border-gray-200 pt-6 mt-10">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                  </div>
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={handleLike}
                      disabled={hasLiked || liking}
                      className="flex items-center space-x-1"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill={hasLiked ? "currentColor" : "none"}
                        className={`w-5 h-5 ${hasLiked ? 'text-red-500' : 'text-muted-foreground'}`}
                      >
                        <path
                          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                      <span className="text-sm text-muted-foreground">
                        {post.likes}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            {/* Related Posts */}
            <AnimatedSection delay={0.4}>
              <RelatedPosts currentPost={post} />
            </AnimatedSection>

            <AnimatedSection delay={0.5}>
              <CommentSection blogId={post._id} />
            </AnimatedSection>
          </article>
        </div>
      </section>
    </PageTransition>
  );
}
