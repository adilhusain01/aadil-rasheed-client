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

// Define and normalize the API base URL
let API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Ensure API_URL is properly formatted (no trailing slash)
if (API_URL.endsWith('/')) {
  API_URL = API_URL.slice(0, -1);
}

// More useful logging for debugging
console.log(`[API Debug] API_URL: ${API_URL}`);
console.log(`[API Debug] Environment: ${process.env.NODE_ENV}`);
console.log(`[API Debug] Is server: ${typeof window === 'undefined'}`);
console.log(`[API Debug] NEXT_PUBLIC_API_URL env: ${process.env.NEXT_PUBLIC_API_URL}`);

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
  // Enhanced detection of build-time/SSG environments
  const isBuild = (
    // Standard check for server-side rendering
    (process.env.NODE_ENV === 'production' && typeof window === 'undefined') ||
    // Additional check for Next.js static generation
    process.env.NEXT_PHASE === 'phase-production-build' ||
    // Check for static path generation
    (typeof window === 'undefined' && process.env.NEXT_RUNTIME === 'nodejs' && Boolean(process.env.GENERATING_STATIC_PARAMS))
  );
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

// export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost> {
//   // Ensure slug is properly encoded
//   const encodedSlug = encodeURIComponent(slug);
//   console.log(`[API Debug] fetchBlogPostBySlug() - Starting request to ${API_URL}/blog/${encodedSlug}`);
  
//   // Log information about the request for debugging
//   console.log(`[API Debug] fetchBlogPostBySlug processing slug: '${slug}' (encoded: '${encodedSlug}')`); 

//   // During build time or in development environment, return appropriate mock data
//   if (isBuildTime() || process.env.NODE_ENV === 'development') {
//     console.log(`[API Debug] Build time or development environment detected, returning mock data for blog post with slug: ${slug}`);
    
//     // For specific critical slugs, provide more detailed mock data
//     if (slug === 'ham-pe-laazim-hai-ki-ham-waqt-ko-zaaya-na-karein') {
//       return {
//         _id: 'mock-urdu-post-id',
//         title: 'ہم پے لازم ہے کہ ہم وقت کو ضایع نہ کریں',
//         slug: 'ham-pe-laazim-hai-ki-ham-waqt-ko-zaaya-na-karein',
//         excerpt: 'A thoughtful reflection on the value of time',
//         content: '<p>This is detailed mock content for this specific Urdu blog post.</p>',
//         date: '2023-10-15T12:00:00Z',
//         likes: 42,
//         isPublished: true,
//         tags: ['urdu', 'poetry', 'reflection']
//       };
//     }
    
//     // Generic mock data for other slugs
//     return {
//       _id: `mock-id-${slug}`,
//       title: `Mock Blog Post: ${slug.replace(/-/g, ' ')}`,
//       slug: slug,
//       excerpt: 'This is a mock blog post for build time',
//       content: '<p>Mock content for static generation</p>',
//       date: new Date().toISOString(),
//       likes: 0,
//       isPublished: true,
//       tags: []
//     };
//   }
  
//   try {
//     // Implement a retry mechanism for reliability
//     let attempts = 0;
//     const maxAttempts = 3;
//     let lastError;
    
//     while (attempts < maxAttempts) {
//       try {
//         console.log(`[API Debug] Fetching from: ${API_URL}/blog/${encodedSlug} (Attempt ${attempts + 1}/${maxAttempts})`);
//         const data = await safeFetch(`${API_URL}/blog/${encodedSlug}`);
        
//         // Validate response
//         if (!data) {
//           throw new Error('Empty response received');
//         }
        
//         if (!data.success) {
//           console.error(`[API Debug] API returned error: ${data.error}`);
//           throw new Error(Array.isArray(data.error) ? data.error[0] : (data.error || 'Unknown error'));
//         }
        
//         // Validate data structure
//         if (!data.data || typeof data.data !== 'object') {
//           console.error('[API Debug] Invalid response structure:', data);
//           throw new Error('Invalid response structure');
//         }
        
//         return data.data;
//       } catch (error) {
//         lastError = error;
//         console.warn(`[API Debug] Attempt ${attempts + 1} failed:`, error);
//         attempts++;
        
//         if (attempts < maxAttempts) {
//           // Exponential backoff
//           await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 500));
//         }
//       }
//     }
    
//     // All attempts failed
//     console.error(`[API Debug] All ${maxAttempts} attempts failed for slug ${slug}`);
    
//     // For a production environment, consider providing fallback content rather than throwing
//     if (process.env.NODE_ENV === 'production') {
//       console.log('[API Debug] Production environment detected, returning fallback content');
      
//       // Format the title nicely from the slug
//       const formattedTitle = slug
//         .replace(/-/g, ' ')
//         .replace(/\./g, ' ')
//         .replace(/_/g, ' ')
//         .split(' ')
//         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(' ');
      
//       return {
//         _id: `fallback-${slug}`,
//         title: formattedTitle,
//         slug: slug,
//         excerpt: 'Content temporarily unavailable',
//         content: '<p>This blog post is available on request. Please check back later.</p>',
//         date: new Date().toISOString(),
//         likes: 0,
//         isPublished: true,
//         tags: []
//       };
//     }
    
//     throw lastError;
//   } catch (error) {
//     console.error(`[API Debug] Error fetching blog post with slug ${slug}:`, error);
    
//     // In production, don't throw errors to the client - provide fallback content instead
//     if (process.env.NODE_ENV === 'production') {
//       return {
//         _id: `error-${slug}`,
//         title: `${slug.replace(/-/g, ' ')}`,
//         slug: slug,
//         excerpt: 'Content temporarily unavailable',
//         content: '<p>We apologize, but this content is temporarily unavailable. Please check back later.</p>',
//         date: new Date().toISOString(),
//         likes: 0,
//         isPublished: true,
//         tags: []
//       };
//     }
    
//     throw error;
//   }
// }

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost> {
  // Strip any query parameters from the slug before encoding
  const cleanSlug = slug.split('?')[0];
  const encodedSlug = encodeURIComponent(cleanSlug);
  console.log(`[API Debug] fetchBlogPostBySlug() - Starting request to ${API_URL}/blog/${encodedSlug}`);
  
  // Prepare fallback content based on slug
  const getFallbackContent = (slugValue: string) => {
    // Clean the slug before formatting
    const cleanValue = slugValue.split('?')[0];
    
    // Format the title nicely from the slug
    const formattedTitle = cleanValue
      .replace(/-/g, ' ')
      .replace(/\./g, ' ')
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Special case for the Urdu post
    if (cleanValue === 'ham-pe-laazim-hai-ki-ham-waqt-ko-zaaya-na-karein') {
      console.log('[API Debug] Returning hardcoded Urdu post fallback');
      return {
        _id: 'mock-urdu-post-id',
        title: 'ہم پے لازم ہے کہ ہم وقت کو ضایع نہ کریں',
        slug: 'ham-pe-laazim-hai-ki-ham-waqt-ko-zaaya-na-karein',
        excerpt: 'A thoughtful reflection on the value of time',
        content: '<p>This is detailed mock content for this specific Urdu blog post.</p>',
        date: '2023-10-15T12:00:00Z',
        likes: 42,
        isPublished: true,
        tags: ['urdu', 'poetry', 'reflection']
      };
    }
    
    // Generic fallback for any other slug
    console.log(`[API Debug] Returning generic fallback for slug: ${cleanValue}`);
    return {
      _id: `fallback-${cleanValue}`,
      title: formattedTitle,
      slug: cleanValue,
      excerpt: 'Content temporarily unavailable',
      content: '<p>This blog post content will be loaded from the server.</p>',
      date: new Date().toISOString(),
      likes: 0,
      isPublished: true,
      tags: []
    };
  };

  // During build time or in development environment, return appropriate mock data
  if (isBuildTime() || process.env.NODE_ENV === 'development') {
    console.log(`[API Debug] Build time or development environment detected, returning mock data for blog post with slug: ${cleanSlug}`);
    return getFallbackContent(cleanSlug);
  }
  
  try {
    // Implement a retry mechanism for reliability
    let attempts = 0;
    const maxAttempts = 3;
    let lastError;
    
    while (attempts < maxAttempts) {
      try {
        console.log(`[API Debug] Fetching from: ${API_URL}/blog/${encodedSlug} (Attempt ${attempts + 1}/${maxAttempts})`);
        const data = await safeFetch(`${API_URL}/blog/${encodedSlug}`);
        
        // Validate response
        if (!data) {
          console.error('[API Debug] Empty response received');
          throw new Error('Empty response received');
        }
        
        if (!data.success) {
          console.error(`[API Debug] API returned error: ${data.error}`);
          throw new Error(Array.isArray(data.error) ? data.error[0] : (data.error || 'Unknown error'));
        }
        
        // Validate data structure
        if (!data.data || typeof data.data !== 'object') {
          console.error('[API Debug] Invalid response structure:', data);
          throw new Error('Invalid response structure');
        }
        
        console.log(`[API Debug] Successfully fetched blog post: ${data.data.title}`);
        return data.data;
      } catch (error) {
        lastError = error;
        console.warn(`[API Debug] Attempt ${attempts + 1} failed:`, error);
        attempts++;
        
        if (attempts < maxAttempts) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 500));
        }
      }
    }
    
    // All attempts failed - return fallback rather than throwing
    console.error(`[API Debug] All ${maxAttempts} attempts failed for slug ${cleanSlug}`);
    return getFallbackContent(cleanSlug);
  } catch (error) {
    console.error(`[API Debug] Error fetching blog post with slug ${cleanSlug}:`, error);
    // Always provide fallback content instead of throwing errors
    return getFallbackContent(cleanSlug);
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
