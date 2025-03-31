"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";
import RelatedPosts from "@/components/blog/RelatedPosts";
import CommentSection from "@/components/blog/CommentSection";
import { fetchBlogPosts, fetchBlogPostBySlug, likeBlogPost } from "@/lib/api";
import type { BlogPost } from "@/lib/api"; // Import the type instead of redefining

export default function BlogPostPage() {
  // Use useParams hook instead of props to get params
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug as string;
  
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
        const fetchedPost = await fetchBlogPostBySlug(slug);
        setPost(fetchedPost);
      } catch (err) {
        console.error(`Error fetching blog post with slug ${slug}:`, err);
        setError('Failed to load blog post');
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
          <div className="animate-pulse">Loading post...</div>
        </div>
      </PageTransition>
    );
  }

  if (error || !post) {
    return (
      <PageTransition>
        <div className="mt-[5rem] px-4 flex justify-center items-center min-h-[50vh]">
          <div className="text-red-500">{error || 'Post not found'}</div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <section className="mt-[5rem] px-4">
        <div className="w-full max-w-5xl mx-auto py-4">
          <Link href="/blog" className="hover:text-primary transition-colors">
            All posts
          </Link>
        </div>
        <div className="w-full max-w-5xl mx-auto px-4 py-12 border-[1px]">
          <article className="w-full max-w-3xl mx-auto">
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
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
                <div className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">
                    {post.title}
                  </h1>
                  <p className="font-semibold">{post.excerpt}</p>
                </div>

                <div className="relative w-full h-[400px] mb-8">
                  <Image
                    src={post.image || '/placeholder.jpg'}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </header>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div
                className="prose prose-stone max-w-none mb-10 space-y-5"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="border-t border-gray-200 pt-6 mt-10">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                  </div>
                  <div className="flex items-center space-x-4">
                    <button 
                      className={`flex items-center space-x-1 transition-all ${hasLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                      onClick={handleLike}
                      disabled={liking || hasLiked}
                      aria-label={hasLiked ? "Already liked" : "Like post"}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill={hasLiked ? "currentColor" : "none"}
                        className="w-5 h-5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                        ></path>
                      </svg>
                      <span className={`text-sm ${hasLiked ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {post.likes || 0}
                      </span>
                    </button>
                    <div className="flex items-center space-x-1">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-5 h-5 text-muted-foreground"
                      >
                        <path
                          d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                      <span className="text-sm text-muted-foreground">
                        {(post as any).comments?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <RelatedPosts currentPost={post} />
            
            {/* Comment Section */}
            <AnimatedSection delay={0.4}>
              {post && <CommentSection blogId={post._id} />}
            </AnimatedSection>
          </article>
        </div>
      </section>
    </PageTransition>
  );
}
