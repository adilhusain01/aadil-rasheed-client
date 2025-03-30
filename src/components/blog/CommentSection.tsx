"use client";

import { useState, useRef, useEffect } from 'react';
import { fetchBlogComments, submitComment } from '@/lib/api';
import CommentItem from '@/components/blog/CommentItem';
import ReCaptcha, { ReCaptchaHandle } from "../ReCaptcha";

export interface Comment {
  _id: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

interface CommentSectionProps {
  blogId: string;
}

const CommentSection = ({ blogId }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const recaptchaRef = useRef<ReCaptchaHandle>(null);

  useEffect(() => {
    async function loadComments() {
      try {
        setLoading(true);
        const data = await fetchBlogComments(blogId);
        setComments(data);
      } catch (err) {
        console.error('Error loading comments:', err);
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    }

    loadComments();
  }, [blogId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.content) {
      setSubmitStatus({
        success: false,
        message: 'Please fill in all fields'
      });
      return;
    }

    setSubmitting(true);
    setSubmitStatus(null);

    try {
      // Execute reCAPTCHA verification
      const recaptchaToken = await recaptchaRef.current?.executeReCaptcha() || '';
      
      if (!recaptchaToken) {
        throw new Error("Bot verification failed. Please try again.");
      }
      
      const newComment = await submitComment(blogId, formData, recaptchaToken);
      setSubmitStatus({
        success: true,
        message: 'Your comment has been submitted and is awaiting approval'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        content: ''
      });
      
      // Reset reCAPTCHA
      recaptchaRef.current?.resetReCaptcha();
      
      // Hide form after successful submission
      setTimeout(() => {
        setShowForm(false);
      }, 3000);
    } catch (err) {
      setSubmitStatus({
        success: false,
        message: err instanceof Error ? err.message : 'Failed to submit comment'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const addNewReply = (parentId: string, reply: Comment) => {
    setComments(prevComments => 
      prevComments.map(comment => {
        if (comment._id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply]
          };
        }
        return comment;
      })
    );
  };

  return (
    <div className="mt-10 pt-8 border-t border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-serif">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm text-primary hover:underline transition-all"
        >
          {showForm ? 'Cancel' : 'Leave a comment'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-4 mb-6 rounded-md">
          <h4 className="text-lg font-medium mb-4">Leave a comment</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-sm p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email * (will not be published)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-sm p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Comment *
              </label>
              <textarea
                id="content"
                name="content"
                rows={4}
                value={formData.content}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-sm p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                required
              ></textarea>
            </div>
            
            {submitStatus && (
              <div className={`text-sm ${submitStatus.success ? 'text-green-600' : 'text-red-600'} p-2 bg-gray-100 rounded`}>
                {submitStatus.message}
              </div>
            )}
            
            {/* reCAPTCHA component (invisible) */}
            <ReCaptcha ref={recaptchaRef} />
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-primary text-white px-4 py-2 rounded-sm text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Comment'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse p-4 text-center">Loading comments...</div>
      ) : error ? (
        <div className="text-red-500 p-4 text-center">{error}</div>
      ) : comments.length === 0 ? (
        <div className="text-gray-500 p-4 text-center">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="space-y-6">
          {comments.map(comment => (
            <CommentItem 
              key={comment._id} 
              comment={comment}
              blogId={blogId}
              onReplyAdded={addNewReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
