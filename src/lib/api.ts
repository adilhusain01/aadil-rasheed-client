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

// Create a safer fetch function with proper credentials
const safeFetch = async (url: string, options: RequestInit = {}) => {
  // Set credentials to include by default for all requests
  const fetchOptions: RequestInit = {
    ...options,
    credentials: 'include', 
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };
  
  console.log(`[API Debug] Fetching with options:`, {
    url,
    method: fetchOptions.method || 'GET',
    credentials: fetchOptions.credentials
  });
  
  try {
    const response = await fetch(url, fetchOptions);
    console.log(`[API Debug] Response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Check if response can be parsed as JSON
    const contentType = response.headers.get('content-type');
    console.log(`[API Debug] Content-Type: ${contentType}`);
    
    if (contentType && contentType.includes('application/json')) {
      const jsonData = await response.json();
      console.log(`[API Debug] Raw response data:`, jsonData);
      return jsonData;
    } else {
      console.error('[API Debug] Response is not JSON:', contentType);
      return { success: false, error: 'Invalid response format' };
    }
  } catch (error) {
    console.error(`[API Debug] Fetch error for ${url}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// A utility function to make authenticated API requests
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  // Get token from localStorage if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // Set up headers with auth token if available
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Setup request options
  const requestOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include' // Always include credentials for cookies
  };
  
  console.log(`[Admin API] Requesting ${url} with auth`, { 
    method: requestOptions.method || 'GET',
    hasToken: !!token
  });
  
  try {
    const response = await fetch(url, requestOptions);
    
    console.log(`[Admin API] Response status:`, response.status);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`[Admin API] Error fetching ${url}:`, error);
    throw error;
  }
};

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
    const data = await safeFetch(`${API_URL}/blog`);

    console.log(`[API Debug] Complete response data:`, JSON.stringify(data));
    
    if (!data || !data.success) {
      console.error(`[API Debug] API returned error or invalid data:`, data);
      return [];
    }
    
    if (!Array.isArray(data.data)) {
      console.error(`[API Debug] Expected array but got:`, typeof data.data, data.data);
      return [];
    }
    
    console.log(`[API Debug] Got ${data.data.length} blog posts`);
    return data.data;
  } catch (error) {
    console.error('[API Debug] Error fetchBlogPosts:', error);
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
    const data = await safeFetch(`${API_URL}/blog/${slug}`);
    
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
    const data = await safeFetch(`${API_URL}/blog/${id}/like`, {
      method: 'PUT'
    });
    
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
    const data = await safeFetch(`${API_URL}/social`);
    
    if (!data.success) {
      console.error(`[API Debug] API returned error: ${data.error}`);
      return [];
    }
    
    console.log(`[API Debug] Got ${data.data?.length || 0} social links`);
    return data.data;
  } catch (error) {
    console.error('[API Debug] Error fetchSocialMediaLinks:', error);
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
    const data = await safeFetch(`${API_URL}/gallery`);
    
    if (!data.success) {
      console.error(`[API Debug] API returned error: ${data.error}`);
      return [];
    }
    
    console.log(`[API Debug] Got ${data.data?.length || 0} gallery images`);
    return data.data;
  } catch (error) {
    console.error('[API Debug] Error fetchGalleryImages:', error);
    return [];
  }
}

// Contact Form API
export async function submitContactForm(formData: ContactFormData, recaptchaToken: string): Promise<{ message: string }> {
  console.log(`[API Debug] submitContactForm() - Starting request to ${API_URL}/contact`);
  
  try {
    console.log(`[API Debug] Fetching from: ${API_URL}/contact`);
    const data = await safeFetch(`${API_URL}/contact`, {
      method: 'POST',
      body: JSON.stringify({
        ...formData,
        recaptchaToken
      })
    });
    
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
    const data = await safeFetch(`${API_URL}/subscription`, {
      method: 'POST',
      body: JSON.stringify({
        ...formData,
        recaptchaToken
      })
    });
    
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
    
    const data = await safeFetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData
    });
    
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
    const data = await safeFetch(`${API_URL}/blog/${blogId}/comments`);
    
    if (!data.success) {
      console.error(`[API Debug] API returned error: ${data.error}`);
      return [];
    }
    
    console.log(`[API Debug] Got ${data.data?.length || 0} comments`);
    return data.data;
  } catch (error) {
    console.error('[API Debug] Error fetching comments:', error);
    return [];
  }
}

export async function submitComment(blogId: string, commentData: CommentData, recaptchaToken: string): Promise<Comment> {
  console.log(`[API Debug] submitComment() - Starting request to ${API_URL}/blog/${blogId}/comments`);
  
  try {
    console.log(`[API Debug] Fetching from: ${API_URL}/blog/${blogId}/comments`);
    const data = await safeFetch(`${API_URL}/blog/${blogId}/comments`, {
      method: 'POST',
      body: JSON.stringify({
        ...commentData,
        recaptchaToken
      })
    });
    
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
    const data = await safeFetch(`${API_URL}/blog/comments/${commentId}/replies`, {
      method: 'POST',
      body: JSON.stringify({
        ...replyData,
        recaptchaToken
      })
    });
    
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
