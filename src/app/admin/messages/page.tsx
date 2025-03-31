"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import Sidebar from "@/components/admin/Sidebar";
import { Eye, Trash2, X, Mail, CheckCircle, XCircle } from "lucide-react";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch contact messages');
      }
      
      const data = await res.json();
      setMessages(data.data);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      setError('Failed to load contact messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleOpenModal = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
    
    // If message is unread, mark it as read
    if (!message.isRead) {
      try {
        setMarkingAsRead(message._id);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/${message._id}/read`, {
          method: 'PUT',
          credentials: 'include',
        });
        
        if (res.ok) {
          // Update the messages list with the read status
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg._id === message._id ? { ...msg, isRead: true } : msg
            )
          );
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      } finally {
        setMarkingAsRead(null);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    try {
      setMarkingAsRead(id);
      const endpoint = isRead ? 'unread' : 'read';
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/${id}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to mark message as ${isRead ? 'unread' : 'read'}`);
      }
      
      // Update the messages list with the new read status
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg._id === id ? { ...msg, isRead: !isRead } : msg
        )
      );
    } catch (error) {
      console.error(`Error marking message as ${isRead ? 'unread' : 'read'}:`, error);
      setError(`Failed to mark message as ${isRead ? 'unread' : 'read'}. Please try again.`);
    } finally {
      setMarkingAsRead(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        setDeleteId(id);
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        
        if (!res.ok) {
          throw new Error('Failed to delete contact message');
        }
        
        // Remove the deleted message from the state
        setMessages(prevMessages => prevMessages.filter(msg => msg._id !== id));
        
        // If the deleted message is currently being displayed, close the modal
        if (selectedMessage && selectedMessage._id === id) {
          handleCloseModal();
        }
      } catch (error) {
        console.error('Error deleting contact message:', error);
        setError('Failed to delete contact message. Please try again.');
      } finally {
        setIsDeleting(false);
        setDeleteId(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        
        <div className="flex-1 overflow-auto">
          <main className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Contact Messages</h1>
                <p className="text-gray-600">Manage messages from your contact form</p>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-lg">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold mb-4">No Messages Found</h3>
                <p className="text-gray-600">You haven't received any contact messages yet.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {messages.map((message) => (
                      <tr key={message._id} className={`hover:bg-gray-50 ${!message.isRead ? 'bg-blue-50' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {message.isRead ? (
                            <CheckCircle size={20} className="text-green-500" />
                          ) : (
                            <div className="flex">
                              <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${!message.isRead ? 'font-semibold' : 'text-gray-900'}`}>
                            {message.name}
                          </div>
                          <div className="text-sm text-gray-500">{message.email}</div>
                        </td>
                        <td className="px-6 py-4">
                        <div
  className={`text-sm ellipsis text-ellipsis ${!message.isRead ? 'font-semibold' : 'text-gray-900'} truncate max-w-xs overflow-hidden whitespace-nowrap`}
>
  {message.message}
</div>

                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(message.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleOpenModal(message)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            disabled={markingAsRead === message._id}
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleMarkAsRead(message._id, message.isRead)}
                            className={`${message.isRead ? 'text-blue-600 hover:text-blue-900' : 'text-green-600 hover:text-green-900'} mr-3`}
                            disabled={markingAsRead === message._id}
                          >
                            {message.isRead ? <XCircle size={18} /> : <CheckCircle size={18} />}
                          </button>
                          <button
                            onClick={() => handleDelete(message._id)}
                            disabled={isDeleting && deleteId === message._id}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
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

      {/* Modal for viewing message details */}
      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold truncate flex-1">
                {selectedMessage.subject}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 ml-4"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedMessage.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      <a href={`mailto:${selectedMessage.email}`} className="hover:underline flex items-center">
                        <Mail size={16} className="mr-1" />
                        {selectedMessage.email}
                      </a>
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(selectedMessage.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 text-gray-800 whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>
            
            <div className="flex justify-between p-6 border-t bg-gray-50">
              <div>
                <button
                  onClick={() => handleMarkAsRead(selectedMessage._id, selectedMessage.isRead)}
                  disabled={markingAsRead === selectedMessage._id}
                  className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium ${
                    selectedMessage.isRead 
                    ? 'border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100' 
                    : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                  }`}
                >
                  {selectedMessage.isRead ? (
                    <>
                      <XCircle size={18} className="mr-2" />
                      Mark as Unread
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} className="mr-2" />
                      Mark as Read
                    </>
                  )}
                </button>
              </div>
              <button
                onClick={() => handleDelete(selectedMessage._id)}
                disabled={isDeleting && deleteId === selectedMessage._id}
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100"
              >
                <Trash2 size={18} className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
