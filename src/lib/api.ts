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

console.log(API_URL);

// Helper to check if we're in build/SSG mode
const isBuildTime = () => {
  return process.env.NODE_ENV === 'production' && typeof window === 'undefined';
};

// Empty mock data for build time
const EMPTY_BLOG_POSTS: BlogPost[] = [];
const EMPTY_SOCIAL_LINKS: SocialMediaLink[] = [];
const EMPTY_GALLERY_IMAGES: GalleryImage[] = [];

// Blog Post API
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  // During build time, return empty data to avoid API calls
  if (isBuildTime()) {
    console.log('Build time detected, returning mock data for blog posts');
    return EMPTY_BLOG_POSTS;
  }

  try {
    const response = await fetch(`${API_URL}/blog`);
    
    // Handle 404 errors gracefully
    if (response.status === 404) {
      console.error('Blog API endpoint not found');
      return [];
    }
    
    const data: ApiResponse<BlogPost[]> = await response.json();
    
    if (!data.success) {
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    // Return empty array instead of throwing during build
    return [];
  }
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost> {
  // During build time, return mock data
  if (isBuildTime()) {
    console.log('Build time detected, returning mock data for blog post');
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
    const response = await fetch(`${API_URL}/blog/${slug}`);
    
    // Handle 404 errors gracefully
    if (response.status === 404) {
      console.error(`Blog post with slug ${slug} not found`);
      throw new Error('Blog post not found');
    }
    
    const data: ApiResponse<BlogPost> = await response.json();
    
    if (!data.success) {
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    throw error;
  }
}

export async function likeBlogPost(id: string): Promise<BlogPost> {
  try {
    const response = await fetch(`${API_URL}/blog/${id}/like`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data: ApiResponse<BlogPost> = await response.json();
    
    if (!data.success) {
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error(`Error liking blog post with id ${id}:`, error);
    throw error;
  }
}

// Social Media API
export async function fetchSocialMediaLinks(): Promise<SocialMediaLink[]> {
  // During build time, return empty data
  if (isBuildTime()) {
    console.log('Build time detected, returning mock data for social links');
    return EMPTY_SOCIAL_LINKS;
  }
  
  try {
    const response = await fetch(`${API_URL}/social`);
    
    // Handle 404 errors gracefully
    if (response.status === 404) {
      console.error('Social API endpoint not found');
      return [];
    }
    
    const data: ApiResponse<SocialMediaLink[]> = await response.json();
    
    if (!data.success) {
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching social media links:', error);
    // Return empty array instead of throwing during build
    return [];
  }
}

// Gallery API
export async function fetchGalleryImages(): Promise<GalleryImage[]> {
  // During build time, return empty data
  if (isBuildTime()) {
    console.log('Build time detected, returning mock data for gallery images');
    return EMPTY_GALLERY_IMAGES;
  }
  
  try {
    const response = await fetch(`${API_URL}/gallery`);
    
    // Handle 404 errors gracefully
    if (response.status === 404) {
      console.error('Gallery API endpoint not found');
      return [];
    }
    
    const data: ApiResponse<GalleryImage[]> = await response.json();
    
    if (!data.success) {
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    // Return empty array instead of throwing during build
    return [];
  }
}

// Contact Form API
export async function submitContactForm(formData: ContactFormData, recaptchaToken: string): Promise<{ message: string }> {
  try {
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
    
    const data: ApiResponse<{ message: string }> = await response.json();
    
    if (!data.success) {
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
}

// Subscription API
export async function submitSubscription(formData: SubscriptionData, recaptchaToken: string): Promise<{ message: string }> {
  try {
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
    
    const data: ApiResponse<{ message: string }> = await response.json();
    
    if (!data.success) {
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('Error submitting subscription:', error);
    throw error;
  }
}

// Upload API
export async function uploadImage(file: File): Promise<{ imageUrl: string }> {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    
    const data: ApiResponse<{ imageUrl: string }> = await response.json();
    
    if (!data.success) {
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Comment API
export async function fetchBlogComments(blogId: string): Promise<Comment[]> {
  try {
    const response = await fetch(`${API_URL}/blog/${blogId}/comments`);
    const data: ApiResponse<Comment[]> = await response.json();
    
    if (!data.success) {
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

export async function submitComment(blogId: string, commentData: CommentData, recaptchaToken: string): Promise<Comment> {
  try {
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
    
    const data: ApiResponse<Comment> = await response.json();
    
    if (!data.success) {
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('Error submitting comment:', error);
    throw error;
  }
}

export async function submitReply(commentId: string, replyData: CommentData, recaptchaToken: string): Promise<Comment> {
  try {
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
    
    const data: ApiResponse<Comment> = await response.json();
    
    if (!data.success) {
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('Error submitting reply:', error);
    throw error;
  }
}
