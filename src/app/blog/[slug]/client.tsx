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
        <div className="container mx-auto">
          {/* Back Link */}
          <div className="mb-6">
            <Link href="/blog" className="text-blue-500 hover:text-blue-700 flex items-center group">
              <span className="transform transition-transform group-hover:-translate-x-1">←</span> 
              <span className="ml-2">Back to all posts</span>
            </Link>
          </div>
          
          {/* Title Section */}
          <AnimatedSection className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center text-gray-600 mb-8">
              <span className="mr-4">{new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 15.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm0-12c-4.42 0-8 3.58-8 8 0 4.42 3.58 8 8 8 4.42 0 8-3.58 8-8 0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-3.31 2.69-6 6-6 3.31 0 6 2.69 6 6 0 3.31-2.69 6-6 6z"/>
                </svg>
                {post.likes} {post.likes === 1 ? 'like' : 'likes'}
                <button 
                  onClick={handleLike}
                  disabled={hasLiked || liking}
                  className={`ml-2 p-1 rounded-full focus:outline-none transition-colors ${
                    hasLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                  }`}
                  title={hasLiked ? 'You already liked this post' : 'Like this post'}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            </div>
          </AnimatedSection>
          
          {/* Featured Image */}
          {post.image && (
            <AnimatedSection className="mb-8">
              <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
                <Image 
                  src={post.image} 
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </AnimatedSection>
          )}
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <AnimatedSection className="mb-8">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </AnimatedSection>
          )}
          
          {/* Content */}
          <AnimatedSection className="prose prose-lg max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </AnimatedSection>
          
          {/* Related Posts */}
          <AnimatedSection>
            <RelatedPosts currentPost={post} />
          </AnimatedSection>

          <AnimatedSection>
            <CommentSection blogId={post._id} />
          </AnimatedSection>
        </div>
      </section>
    </PageTransition>
  );
}
