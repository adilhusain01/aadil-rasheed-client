// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import PageTransition from "@/components/PageTransition";
// import AnimatedSection from "@/components/AnimatedSection";
// import RelatedPosts from "@/components/blog/RelatedPosts";
// import CommentSection from "@/components/blog/CommentSection";
// import { fetchBlogPostBySlug, likeBlogPost } from "@/lib/api";
// import type { BlogPost } from "@/lib/api";

// export default function BlogPostClient({ slug }: { slug: string }) {
//   const [post, setPost] = useState<BlogPost | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [liking, setLiking] = useState(false);
//   const [hasLiked, setHasLiked] = useState(false);

//   useEffect(() => {
//     // Check if user has already liked this post
//     const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
//     if (post && likedPosts.includes(post._id)) {
//       setHasLiked(true);
//     }
//   }, [post]);

//   useEffect(() => {
//     async function loadPost() {
//       try {
//         setLoading(true);
//         console.log(`[Blog Post Client] Loading post with slug: ${slug}`);
        
//         // Implement retry logic for client-side fetching
//         const maxRetries = 3;
//         let retryCount = 0;
//         let success = false;
        
//         while (!success && retryCount < maxRetries) {
//           try {
//             const fetchedPost = await fetchBlogPostBySlug(slug);
//             console.log(`[Blog Post Client] Successfully loaded post: ${fetchedPost.title}`);
//             setPost(fetchedPost);
//             success = true;
//           } catch (fetchError) {
//             retryCount++;
//             console.warn(`[Blog Post Client] Retry ${retryCount}/${maxRetries} failed:`, fetchError);
            
//             if (retryCount < maxRetries) {
//               // Wait before retrying with exponential backoff
//               await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 500));
//             } else {
//               throw fetchError; // Re-throw if all retries failed
//             }
//           }
//         }
//       } catch (err) {
//         console.error(`[Blog Post Client] Error fetching blog post with slug ${slug}:`, err);
//         setError('Failed to load blog post. Please try refreshing the page.');
//       } finally {
//         setLoading(false);
//       }
//     }
    
//     if (slug) {
//       loadPost();
//     }
//   }, [slug]);

//   const handleLike = async () => {
//     if (!post || liking || hasLiked) return;
    
//     try {
//       setLiking(true);
//       const updatedPost = await likeBlogPost(post._id);
      
//       // Update post with new like count
//       setPost({
//         ...post,
//         likes: updatedPost.likes
//       });
      
//       // Save liked state to localStorage
//       const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
//       likedPosts.push(post._id);
//       localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
      
//       setHasLiked(true);
//     } catch (err) {
//       console.error('Error liking post:', err);
//     } finally {
//       setLiking(false);
//     }
//   };

//   if (loading) {
//     console.log(`[Blog Post Client] Loading state for slug: '${slug}'`);
//     return (
//       <PageTransition>
//         <div className="mt-[5rem] px-4 flex justify-center items-center min-h-[50vh]">
//           <div className="animate-pulse">Loading post: {slug}...</div>
//         </div>
//       </PageTransition>
//     );
//   }

//   if (error || !post) {
//     console.error(`[Blog Post Client] Error or no post data for slug: '${slug}'`, { error, hasPost: !!post });
//     return (
//       <PageTransition>
//         <div className="mt-[5rem] px-4 flex justify-center items-center min-h-[50vh]">
//           <div className="text-center">
//             <h2 className="text-2xl font-bold mb-4">{error ? 'Error Loading Post' : 'Post Not Available'}</h2>
//             <p className="text-red-500 mb-4">{error || 'We couldn\'t find the blog post you\'re looking for.'}</p>
//             <div className="mt-6 flex justify-center space-x-4">
//               <Link href="/blog" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-all">
//                 Browse All Posts
//               </Link>
//               <button 
//                 onClick={() => window.location.reload()}
//                 className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all"
//               >
//                 Try Again
//               </button>
//             </div>
//           </div>
//         </div>
//       </PageTransition>
//     );
//   }

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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
    async function loadPost() {
      try {
        setLoading(true);
        console.log(`[Blog Post Client] Loading post with slug: ${slug}`);
        
        const fetchedPost = await fetchBlogPostBySlug(slug);
        console.log(`[Blog Post Client] Successfully loaded post: ${fetchedPost.title}`);
        setPost(fetchedPost);
        
        // Check if user has already liked this post
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
        if (likedPosts.includes(fetchedPost._id)) {
          setHasLiked(true);
        }
      } catch (err) {
        console.error(`[Blog Post Client] Error fetching blog post with slug ${slug}:`, err);
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
