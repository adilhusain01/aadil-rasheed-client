interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string | string[];
}

// Blog Post types
export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  date: string;
  likes: number;
  isPublished: boolean;
  tags?: string[];
}

// Comment types
export interface Comment {
  _id: string;
  name: string;
  email: string;
  content: string;
  parentId?: string;
  blogId: string;
  isApproved: boolean;
  createdAt: string;
  replies?: Comment[];
}

// Contact form type
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Subscription form type
export interface SubscriptionData {
  email: string;
  name?: string;
}

// Social media link type
export interface SocialMediaLink {
  _id: string;
  platform: string;
  url: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
}

// Gallery image type
export interface GalleryImage {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnail?: string;
  category?: string;
  displayOrder?: number;
}

// Comment data type
export interface CommentData {
  name: string;
  email: string;
  content: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// More useful logging for debugging
console.log(`[API Debug] API_URL: ${API_URL}`);
console.log(`[API Debug] Environment: ${process.env.NODE_ENV}`);
console.log(`[API Debug] Is server: ${typeof window === 'undefined'}`);

// Helper to check if we're in build/SSG mode
const isBuildTime = () => {
  const isBuild = process.env.NODE_ENV === 'production' && typeof window === 'undefined';
  console.log(`[API Debug] isBuildTime(): ${isBuild}`);
  return isBuild;
};

// Empty mock data for build time
const EMPTY_BLOG_POSTS: BlogPost[] = [];
const EMPTY_SOCIAL_LINKS: SocialMediaLink[] = [];
const EMPTY_GALLERY_IMAGES: GalleryImage[] = [];

// Blog Post API
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  console.log(`[API Debug] fetchBlogPosts() - Starting request to ${API_URL}/blog`);
  
  // During build time, return empty data to avoid API calls
  if (isBuildTime()) {
    console.log('[API Debug] Build time detected, returning mock data for blog posts');
    return EMPTY_BLOG_POSTS;
  }

  try {
    console.log(`[API Debug] Fetching from: ${API_URL}/blog`);
    const response = await fetch(`${API_URL}/blog`);
    console.log(`[API Debug] Response status: ${response.status}`);
    
    // Handle 404 errors gracefully
    if (response.status === 404) {
      console.error('[API Debug] Blog API endpoint not found (404)');
      return [];
    }
    
    const data: ApiResponse<BlogPost[]> = await response.json();
    console.log(`[API Debug] Response parsed, success: ${data.success}, items: ${data.data?.length || 0}`);
    
    if (!data.success) {
      console.error(`[API Debug] API returned error: ${data.error}`);
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('[API Debug] Error fetching blog posts:', error);
    // Return empty array instead of throwing during build
    return [];
  }
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost> {
  console.log(`[API Debug] fetchBlogPostBySlug() - Starting request to ${API_URL}/blog/${slug}`);
  
  // During build time, return mock data
  if (isBuildTime()) {
    console.log('[API Debug] Build time detected, returning mock data for blog post');
    return {
      _id: 'mock-id',
      title: 'Mock Blog Post',
      slug: slug,
      excerpt: 'This is a mock blog post for build time',
      content: '<p>Mock content</p>',
      date: new Date().toISOString(),
      likes: 0,
      isPublished: true
    };
  }
  
  try {
    console.log(`[API Debug] Fetching from: ${API_URL}/blog/${slug}`);
    const response = await fetch(`${API_URL}/blog/${slug}`);
    console.log(`[API Debug] Response status: ${response.status}`);
    
    // Handle 404 errors gracefully
    if (response.status === 404) {
      console.error(`[API Debug] Blog post with slug ${slug} not found (404)`);
      throw new Error('Blog post not found');
    }
    
    const data: ApiResponse<BlogPost> = await response.json();
    console.log(`[API Debug] Response parsed, success: ${data.success}`);
    
    if (!data.success) {
      console.error(`[API Debug] API returned error: ${data.error}`);
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error(`[API Debug] Error fetching blog post with slug ${slug}:`, error);
    throw error;
  }
}

export async function likeBlogPost(id: string): Promise<BlogPost> {
  console.log(`[API Debug] likeBlogPost() - Starting request to ${API_URL}/blog/${id}/like`);
  
  try {
    console.log(`[API Debug] Fetching from: ${API_URL}/blog/${id}/like`);
    const response = await fetch(`${API_URL}/blog/${id}/like`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(`[API Debug] Response status: ${response.status}`);
    
    const data: ApiResponse<BlogPost> = await response.json();
    console.log(`[API Debug] Response parsed, success: ${data.success}`);
    
    if (!data.success) {
      console.error(`[API Debug] API returned error: ${data.error}`);
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error(`[API Debug] Error liking blog post with id ${id}:`, error);
    throw error;
  }
}

// Social Media API
export async function fetchSocialMediaLinks(): Promise<SocialMediaLink[]> {
  console.log(`[API Debug] fetchSocialMediaLinks() - Starting request to ${API_URL}/social`);
  
  // During build time, return empty data
  if (isBuildTime()) {
    console.log('[API Debug] Build time detected, returning mock data for social links');
    return EMPTY_SOCIAL_LINKS;
  }
  
  try {
    console.log(`[API Debug] Fetching from: ${API_URL}/social`);
    const response = await fetch(`${API_URL}/social`);
    console.log(`[API Debug] Response status: ${response.status}`);
    
    // Handle 404 errors gracefully
    if (response.status === 404) {
      console.error('[API Debug] Social API endpoint not found (404)');
      return [];
    }
    
    const data: ApiResponse<SocialMediaLink[]> = await response.json();
    console.log(`[API Debug] Response parsed, success: ${data.success}, items: ${data.data?.length || 0}`);
    
    if (!data.success) {
      console.error(`[API Debug] API returned error: ${data.error}`);
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('[API Debug] Error fetching social media links:', error);
    // Return empty array instead of throwing during build
    return [];
  }
}

// Gallery API
export async function fetchGalleryImages(): Promise<GalleryImage[]> {
  console.log(`[API Debug] fetchGalleryImages() - Starting request to ${API_URL}/gallery`);
  
  // During build time, return empty data
  if (isBuildTime()) {
    console.log('[API Debug] Build time detected, returning mock data for gallery images');
    return EMPTY_GALLERY_IMAGES;
  }
  
  try {
    console.log(`[API Debug] Fetching from: ${API_URL}/gallery`);
    const response = await fetch(`${API_URL}/gallery`);
    console.log(`[API Debug] Response status: ${response.status}`);
    
    // Handle 404 errors gracefully
    if (response.status === 404) {
      console.error('[API Debug] Gallery API endpoint not found (404)');
      return [];
    }
    
    const data: ApiResponse<GalleryImage[]> = await response.json();
    console.log(`[API Debug] Response parsed, success: ${data.success}, items: ${data.data?.length || 0}`);
    
    if (!data.success) {
      console.error(`[API Debug] API returned error: ${data.error}`);
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('[API Debug] Error fetching gallery images:', error);
    // Return empty array instead of throwing during build
    return [];
  }
}

// Contact Form API
export async function submitContactForm(formData: ContactFormData, recaptchaToken: string): Promise<{ message: string }> {
  console.log(`[API Debug] submitContactForm() - Starting request to ${API_URL}/contact`);
  
  try {
    console.log(`[API Debug] Fetching from: ${API_URL}/contact`);
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...formData,
        recaptchaToken
      })
    });
    console.log(`[API Debug] Response status: ${response.status}`);
    
    const data: ApiResponse<{ message: string }> = await response.json();
    console.log(`[API Debug] Response parsed, success: ${data.success}`);
    
    if (!data.success) {
      console.error(`[API Debug] API returned error: ${data.error}`);
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('[API Debug] Error submitting contact form:', error);
    throw error;
  }
}

// Subscription API
export async function submitSubscription(formData: SubscriptionData, recaptchaToken: string): Promise<{ message: string }> {
  console.log(`[API Debug] submitSubscription() - Starting request to ${API_URL}/subscription`);
  
  try {
    console.log(`[API Debug] Fetching from: ${API_URL}/subscription`);
    const response = await fetch(`${API_URL}/subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...formData,
        recaptchaToken
      })
    });
    console.log(`[API Debug] Response status: ${response.status}`);
    
    const data: ApiResponse<{ message: string }> = await response.json();
    console.log(`[API Debug] Response parsed, success: ${data.success}`);
    
    if (!data.success) {
      console.error(`[API Debug] API returned error: ${data.error}`);
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('[API Debug] Error submitting subscription:', error);
    throw error;
  }
}

// Upload API
export async function uploadImage(file: File): Promise<{ imageUrl: string }> {
  console.log(`[API Debug] uploadImage() - Starting request to ${API_URL}/upload`);
  
  try {
    console.log(`[API Debug] Fetching from: ${API_URL}/upload`);
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    console.log(`[API Debug] Response status: ${response.status}`);
    
    const data: ApiResponse<{ imageUrl: string }> = await response.json();
    console.log(`[API Debug] Response parsed, success: ${data.success}`);
    
    if (!data.success) {
      console.error(`[API Debug] API returned error: ${data.error}`);
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('[API Debug] Error uploading image:', error);
    throw error;
  }
}

// Comment API
export async function fetchBlogComments(blogId: string): Promise<Comment[]> {
  console.log(`[API Debug] fetchBlogComments() - Starting request to ${API_URL}/blog/${blogId}/comments`);
  
  try {
    console.log(`[API Debug] Fetching from: ${API_URL}/blog/${blogId}/comments`);
    const response = await fetch(`${API_URL}/blog/${blogId}/comments`);
    console.log(`[API Debug] Response status: ${response.status}`);
    
    const data: ApiResponse<Comment[]> = await response.json();
    console.log(`[API Debug] Response parsed, success: ${data.success}, items: ${data.data?.length || 0}`);
    
    if (!data.success) {
      console.error(`[API Debug] API returned error: ${data.error}`);
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('[API Debug] Error fetching comments:', error);
    throw error;
  }
}

export async function submitComment(blogId: string, commentData: CommentData, recaptchaToken: string): Promise<Comment> {
  console.log(`[API Debug] submitComment() - Starting request to ${API_URL}/blog/${blogId}/comments`);
  
  try {
    console.log(`[API Debug] Fetching from: ${API_URL}/blog/${blogId}/comments`);
    const response = await fetch(`${API_URL}/blog/${blogId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...commentData,
        recaptchaToken
      })
    });
    console.log(`[API Debug] Response status: ${response.status}`);
    
    const data: ApiResponse<Comment> = await response.json();
    console.log(`[API Debug] Response parsed, success: ${data.success}`);
    
    if (!data.success) {
      console.error(`[API Debug] API returned error: ${data.error}`);
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('[API Debug] Error submitting comment:', error);
    throw error;
  }
}

export async function submitReply(commentId: string, replyData: CommentData, recaptchaToken: string): Promise<Comment> {
  console.log(`[API Debug] submitReply() - Starting request to ${API_URL}/blog/comments/${commentId}/replies`);
  
  try {
    console.log(`[API Debug] Fetching from: ${API_URL}/blog/comments/${commentId}/replies`);
    const response = await fetch(`${API_URL}/blog/comments/${commentId}/replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...replyData,
        recaptchaToken
      })
    });
    console.log(`[API Debug] Response status: ${response.status}`);
    
    const data: ApiResponse<Comment> = await response.json();
    console.log(`[API Debug] Response parsed, success: ${data.success}`);
    
    if (!data.success) {
      console.error(`[API Debug] API returned error: ${data.error}`);
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('[API Debug] Error submitting reply:', error);
    throw error;
  }
}
