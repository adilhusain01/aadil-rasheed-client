"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import Sidebar from "@/components/admin/Sidebar";
import { Plus, Edit, Trash2, Eye, Calendar, CheckCircle, XCircle } from "lucide-react";
import { BlogPost } from "@/types";

export default function BlogPostsPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const router = useRouter();

  interface BlogPostsResponse {
    success: boolean;
    count: number;
    data: BlogPost[];
  }

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`, {
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      
      const data: BlogPostsResponse = await res.json();
      setBlogPosts(data.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError('Failed to load blog posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        setDeleteId(id);
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/id/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        
        if (!res.ok) {
          throw new Error('Failed to delete blog post');
        }
        
        // Refresh the blog posts list
        await fetchBlogPosts();
      } catch (error) {
        console.error('Error deleting blog post:', error);
        setError('Failed to delete blog post. Please try again.');
      } finally {
        setIsDeleting(false);
        setDeleteId(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      // Check if it's already a formatted date string
      if (dateString.includes(',')) {
        return dateString;
      }
      
      // Otherwise, try to parse and format it
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        
        <div className="flex-1 overflow-auto">
          <main className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Blog Posts</h1>
                <p className="text-gray-600">Manage your blog content</p>
              </div>
              <Link 
                href="/admin/blog/new" 
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
              >
                <Plus size={20} className="mr-2" />
                New Post
              </Link>
            </div>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-lg">Loading blog posts...</p>
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold mb-4">No Blog Posts Found</h3>
                <p className="text-gray-600 mb-6">You haven't created any blog posts yet.</p>
                <Link 
                  href="/admin/blog/new" 
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md inline-flex items-center"
                >
                  <Plus size={20} className="mr-2" />
                  Create Your First Post
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {blogPosts.map((post) => (
                      <tr key={post._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {post.title}
                          </div>
                          <div className="text-sm text-gray-500">/{post.slug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(post.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm space-x-4 mt-2">
                            <div className="flex items-center text-gray-500">
                              <Calendar size={16} className="mr-1" />
                              {new Date(post.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              {post.isPublished ? (
                                <CheckCircle size={16} className="text-green-500 mr-1" />
                              ) : (
                                <XCircle size={16} className="text-red-500 mr-1" />
                              )}
                              <span className={post.isPublished ? "text-green-500" : "text-red-500"}>
                                {post.isPublished ? "Published" : "Draft"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/admin/blog/edit/${post._id}`}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <Edit size={18} className="inline" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post._id)}
                            disabled={isDeleting && deleteId === post._id}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} className="inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
