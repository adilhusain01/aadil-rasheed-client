// Types for blog posts
export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Types for gallery images
export interface GalleryImage {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Types for social media links
export interface SocialMediaLink {
  _id: string;
  type: 'instagram' | 'facebook' | 'twitter';
  url: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Types for contact messages
export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Types for subscribers
export interface Subscriber {
  _id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Types for media uploads
export interface MediaFile {
  _id: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  url: string;
  createdAt: string;
  updatedAt?: string;
}

// User type
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

// Auth context types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
