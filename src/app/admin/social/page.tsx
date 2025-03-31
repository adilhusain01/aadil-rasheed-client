"use client";

import { useState, useEffect, FormEvent } from "react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import Sidebar from "@/components/admin/Sidebar";
import { Plus, Edit, Trash2, X, Save, Instagram, Facebook, Twitter } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";

interface SocialMediaLink {
  _id: string;
  type: 'instagram' | 'facebook' | 'twitter';
  url: string;
  displayOrder: number;
  isActive: boolean;
}

export default function SocialMediaPage() {
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedLink, setSelectedLink] = useState<SocialMediaLink | null>(null);
  const [formData, setFormData] = useState({
    type: 'instagram' as 'instagram' | 'facebook' | 'twitter',
    url: "",
    displayOrder: 0,
    isActive: true
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSocialLinks = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/social/admin/all`);
      setSocialLinks(data.data);
    } catch (error) {
      console.error('Error fetching social media links:', error);
      setError('Failed to load social media links. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const handleOpenModal = (link: SocialMediaLink | null = null) => {
    if (link) {
      setIsEditing(true);
      setSelectedLink(link);
      setFormData({
        type: link.type,
        url: link.url,
        displayOrder: link.displayOrder,
        isActive: link.isActive
      });
    } else {
      setIsEditing(false);
      setSelectedLink(null);
      setFormData({
        type: 'instagram',
        url: "",
        displayOrder: socialLinks.length + 1,
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'displayOrder' ? parseInt(value) : 
              name === 'type' ? value as 'instagram' | 'facebook' | 'twitter' : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      const url = isEditing 
        ? `${process.env.NEXT_PUBLIC_API_URL}/social/${selectedLink?._id}` 
        : `${process.env.NEXT_PUBLIC_API_URL}/social`;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      await fetchWithAuth(url, {
        method,
        body: JSON.stringify(formData)
      });
      
      // Close modal and refresh list
      setIsModalOpen(false);
      await fetchSocialLinks();
    } catch (error) {
      console.error('Error saving social media link:', error);
      setError('Failed to save social media link. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this social media link? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        setDeleteId(id);
        
        await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/social/${id}`, {
          method: 'DELETE'
        });
        
        // Refresh the social links list
        fetchSocialLinks();
      } catch (error) {
        console.error('Error deleting social media link:', error);
        setError('Failed to delete social media link. Please try again.');
      } finally {
        setIsDeleting(false);
        setDeleteId(null);
      }
    }
  };

  const handleToggleActive = async (id: string, currentActiveState: boolean) => {
    try {
      await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/social/${id}/toggle`, {
        method: 'PUT'
      });
      
      // Update the local state
      setSocialLinks(prevLinks => 
        prevLinks.map(link => 
          link._id === id ? { ...link, isActive: !currentActiveState } : link
        )
      );
    } catch (error) {
      console.error('Error toggling social media link active state:', error);
      setError('Failed to update social media link. Please try again.');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'instagram':
        return <Instagram size={20} className="text-pink-600" />;
      case 'facebook':
        return <Facebook size={20} className="text-blue-600" />;
      case 'twitter':
        return <Twitter size={20} className="text-blue-400" />;
      default:
        return <Instagram size={20} />;
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
                <h1 className="text-3xl font-bold text-gray-800">Social Media</h1>
                <p className="text-gray-600">Manage your social media links and embeds</p>
              </div>
              <button 
                onClick={() => handleOpenModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Add Link
              </button>
            </div>
            
            {error && !isModalOpen && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-lg">Loading social media links...</p>
              </div>
            ) : socialLinks.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold mb-4">No Social Media Links Found</h3>
                <p className="text-gray-600 mb-6">You haven't added any social media links yet.</p>
                <button 
                  onClick={() => handleOpenModal()}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md inline-flex items-center"
                >
                  <Plus size={20} className="mr-2" />
                  Add Your First Link
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {socialLinks.map((link) => (
                      <tr key={link._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getTypeIcon(link.type)}
                            <span className="ml-2 capitalize">{link.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 truncate max-w-xs">
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 underline">
                              {link.url}
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {link.displayOrder}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${link.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {link.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleOpenModal(link)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(link._id)}
                            disabled={isDeleting && deleteId === link._id}
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

      {/* Modal for adding/editing social media links */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">
                {isEditing ? 'Edit Social Media Link' : 'Add Social Media Link'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            {error && (
              <div className="px-6 pt-4 text-red-600 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Platform *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  URL *
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.type === 'instagram' ? 
                    'For Instagram, use the format: https://www.instagram.com/reel/ABCDEFG/?utm_source=ig_embed' : 
                    `Enter the full URL to your ${formData.type} post/profile`}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order *
                  </label>
                  <input
                    type="number"
                    id="displayOrder"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center">
                  <div className="mt-6">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleCheckboxChange}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active (visible on website)</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium text-white flex items-center"
                >
                  <Save size={18} className="mr-2" />
                  {submitting ? 'Saving...' : isEditing ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
