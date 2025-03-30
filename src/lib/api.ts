interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string | string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Blog Post API
export async function fetchBlogPosts() {
  try {
    const response = await fetch(`${API_URL}/blog`);
    const data: ApiResponse<any> = await response.json();
    
    if (!data.success) {
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}

export async function fetchBlogPostBySlug(slug: string) {
  try {
    const response = await fetch(`${API_URL}/blog/${slug}`);
    const data: ApiResponse<any> = await response.json();
    
    if (!data.success) {
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    throw error;
  }
}

export async function likeBlogPost(id: string) {
  try {
    const response = await fetch(`${API_URL}/blog/${id}/like`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data: ApiResponse<any> = await response.json();
    
    if (!data.success) {
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('Error liking blog post:', error);
    throw error;
  }
}

// Social Media API
export async function fetchSocialMediaLinks() {
  try {
    const response = await fetch(`${API_URL}/social`);
    const data: ApiResponse<any> = await response.json();
    
    if (!data.success) {
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching social media links:', error);
    throw error;
  }
}

// Gallery API
export async function fetchGalleryImages() {
  try {
    const response = await fetch(`${API_URL}/gallery`);
    const data: ApiResponse<any> = await response.json();
    
    if (!data.success) {
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    throw error;
  }
}

// Contact Form API
export async function submitContactForm(formData: any, recaptchaToken: string) {
  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...formData, recaptchaToken })
    });
    
    const data: ApiResponse<any> = await response.json();
    
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
export async function submitSubscription(formData: any, recaptchaToken: string) {
  try {
    const response = await fetch(`${API_URL}/subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...formData, recaptchaToken })
    });
    
    const data: ApiResponse<any> = await response.json();
    
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
export async function uploadImage(file: File) {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData
    });
    
    const data: ApiResponse<any> = await response.json();
    
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
export async function fetchBlogComments(blogId: string) {
  try {
    const response = await fetch(`${API_URL}/blog/${blogId}/comments`);
    const data: ApiResponse<any> = await response.json();
    
    if (!data.success) {
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

export async function submitComment(blogId: string, commentData: any, recaptchaToken: string) {
  try {
    const response = await fetch(`${API_URL}/blog/${blogId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...commentData, recaptchaToken })
    });
    
    const data: ApiResponse<any> = await response.json();
    
    if (!data.success) {
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('Error submitting comment:', error);
    throw error;
  }
}

export async function submitReply(commentId: string, replyData: any, recaptchaToken: string) {
  try {
    const response = await fetch(`${API_URL}/blog/comments/${commentId}/replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...replyData, recaptchaToken })
    });
    
    const data: ApiResponse<any> = await response.json();
    
    if (!data.success) {
      throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('Error submitting reply:', error);
    throw error;
  }
}
