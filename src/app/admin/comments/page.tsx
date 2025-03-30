"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import Sidebar from "@/components/admin/Sidebar";
import { Trash2, Check, Search, FileText, RefreshCw } from "lucide-react";

interface Comment {
  _id: string;
  name: string;
  email: string;
  content: string;
  blogId: {
    _id: string;
    title: string;
    slug: string;
  };
  parentId: string | null;
  isApproved: boolean;
  createdAt: string;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    async function fetchComments() {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/comments/all`, {
          credentials: 'include',
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch comments');
        }
        
        const data = await res.json();
        setComments(data.data);
        setFilteredComments(data.data);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    }
    
    fetchComments();
  }, []);

  // Filter comments when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredComments(comments);
      return;
    }
    
    const filtered = comments.filter(comment => 
      comment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (comment.blogId && comment.blogId.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredComments(filtered);
  }, [searchTerm, comments]);

  const handleApprove = async (id: string) => {
    try {
      setCurrentAction(id);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/comments/${id}/approve`, {
        method: 'PUT',
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error('Failed to approve comment');
      }
      
      // Update comments state
      setComments(prevComments => 
        prevComments.map(comment => 
          comment._id === id ? { ...comment, isApproved: true } : comment
        )
      );
      
    } catch (err) {
      console.error('Error approving comment:', err);
      alert('Failed to approve comment');
    } finally {
      setCurrentAction(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      setCurrentAction(id);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/comments/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete comment');
      }
      
      // Remove comment from state
      setComments(prevComments => 
        prevComments.filter(comment => comment._id !== id)
      );
      
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Failed to delete comment');
    } finally {
      setCurrentAction(null);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10 bg-gray-50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">Manage Comments</h1>
              <p className="text-gray-600">Review, approve, and manage blog comments</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-md shadow-sm mb-8">
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search comments..."
                className="w-full p-2 pl-10 border border-gray-300 rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-60">
                <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center p-4">{error}</div>
            ) : filteredComments.length === 0 ? (
              <div className="text-gray-500 text-center p-4">
                {searchTerm ? 'No comments match your search.' : 'No comments yet.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Comment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Post
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredComments.map((comment) => (
                      <tr key={comment._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-medium">{comment.name}</span>
                            <span className="text-sm text-gray-500">{comment.email}</span>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{comment.content}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {comment.blogId ? (
                            <Link 
                              href={`/blog/${comment.blogId.slug}`}
                              className="text-primary hover:underline flex items-center"
                              target="_blank"
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              <span className="line-clamp-1">{comment.blogId.title}</span>
                            </Link>
                          ) : (
                            <span className="text-gray-400">Unknown post</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              comment.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {comment.isApproved ? 'Approved' : 'Pending'}
                          </span>
                          {comment.parentId && (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              Reply
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {!comment.isApproved && (
                              <button
                                onClick={() => handleApprove(comment._id)}
                                disabled={currentAction === comment._id}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                title="Approve"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(comment._id)}
                              disabled={currentAction === comment._id}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
