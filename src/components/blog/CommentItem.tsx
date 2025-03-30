"use client";

import { useState, useRef } from 'react';
import { submitReply } from '@/lib/api';
import { Comment } from './CommentSection';
import ReCaptcha, { ReCaptchaHandle } from "../ReCaptcha";

interface CommentItemProps {
  comment: Comment;
  blogId: string;
  onReplyAdded: (parentId: string, reply: Comment) => void;
}

const CommentItem = ({ comment, blogId, onReplyAdded }: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyData, setReplyData] = useState({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReplyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyData.name || !replyData.email || !replyData.content) {
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
      
      const newReply = await submitReply(comment._id, replyData, recaptchaToken);
      setSubmitStatus({
        success: true,
        message: 'Your reply has been submitted and is awaiting approval'
      });
      
      // Reset form
      setReplyData({
        name: '',
        email: '',
        content: ''
      });
      
      // Reset reCAPTCHA
      recaptchaRef.current?.resetReCaptcha();
      
      // Hide form after successful submission
      setTimeout(() => {
        setShowReplyForm(false);
      }, 3000);
    } catch (err) {
      setSubmitStatus({
        success: false,
        message: err instanceof Error ? err.message : 'Failed to submit reply'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="comment-container">
      <div className="comment p-4 border border-gray-200 rounded-md">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold">{comment.name}</h4>
          <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
        </div>
        <p className="text-gray-700 mb-3">{comment.content}</p>
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-sm text-primary hover:underline transition-all"
        >
          {showReplyForm ? 'Cancel' : 'Reply'}
        </button>
      </div>

      {showReplyForm && (
        <div className="ml-6 mt-2 p-4 bg-gray-50 rounded-md">
          <h5 className="text-sm font-medium mb-3">Reply to {comment.name}</h5>
          <form onSubmit={handleSubmitReply} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor={`name-${comment._id}`} className="block text-xs font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id={`name-${comment._id}`}
                  name="name"
                  value={replyData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-sm p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor={`email-${comment._id}`} className="block text-xs font-medium text-gray-700 mb-1">
                  Email * (will not be published)
                </label>
                <input
                  type="email"
                  id={`email-${comment._id}`}
                  name="email"
                  value={replyData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-sm p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor={`content-${comment._id}`} className="block text-xs font-medium text-gray-700 mb-1">
                Reply *
              </label>
              <textarea
                id={`content-${comment._id}`}
                name="content"
                rows={3}
                value={replyData.content}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-sm p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                required
              ></textarea>
            </div>
            
            {submitStatus && (
              <div className={`text-xs ${submitStatus.success ? 'text-green-600' : 'text-red-600'} p-2 bg-gray-100 rounded`}>
                {submitStatus.message}
              </div>
            )}
            
            {/* reCAPTCHA component (invisible) */}
            <ReCaptcha ref={recaptchaRef} />
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-primary text-white px-3 py-1.5 rounded-sm text-xs hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Reply'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Display replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 mt-3 space-y-3">
          {comment.replies.map(reply => (
            <div key={reply._id} className="p-3 border border-gray-100 bg-gray-50 rounded-md">
              <div className="flex justify-between items-start mb-1">
                <h5 className="font-medium text-sm">{reply.name}</h5>
                <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
              </div>
              <p className="text-gray-700 text-sm">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
