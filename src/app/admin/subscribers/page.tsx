"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import Sidebar from "@/components/admin/Sidebar";
import { Trash2, Mail, DownloadCloud, Search } from "lucide-react";

interface Subscriber {
  _id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription`, {
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch subscribers');
      }
      
      const data = await res.json();
      setSubscribers(data.data);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      setError('Failed to load subscribers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscriber? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        setDeleteId(id);
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        
        if (!res.ok) {
          throw new Error('Failed to delete subscriber');
        }
        
        // Remove the deleted subscriber from the state
        setSubscribers(prevSubscribers => prevSubscribers.filter(sub => sub._id !== id));
        setSelectedSubscribers(prev => prev.filter(subId => subId !== id));
      } catch (error) {
        console.error('Error deleting subscriber:', error);
        setError('Failed to delete subscriber. Please try again.');
      } finally {
        setIsDeleting(false);
        setDeleteId(null);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSubscribers.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedSubscribers.length} subscribers? This action cannot be undone.`)) {
      try {
        setIsDeleting(true);
        
        // In a real application, this would be a bulk operation
        // For simplicity, we'll delete them one by one
        for (const id of selectedSubscribers) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription/${id}`, {
            method: 'DELETE',
            credentials: 'include',
          });
        }
        
        // Remove the deleted subscribers from the state
        setSubscribers(prevSubscribers => 
          prevSubscribers.filter(sub => !selectedSubscribers.includes(sub._id))
        );
        
        // Clear selection
        setSelectedSubscribers([]);
        setSelectAll(false);
      } catch (error) {
        console.error('Error deleting subscribers:', error);
        setError('Failed to delete subscribers. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ["Email", "Status", "Date"];
    const rows = subscribers.map(sub => [
      sub.email,
      sub.isActive ? "Active" : "Inactive",
      new Date(sub.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(subscribers.map(sub => sub._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectSubscriber = (id: string) => {
    setSelectedSubscribers(prev => {
      if (prev.includes(id)) {
        return prev.filter(subId => subId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Filter subscribers based on search term
  const filteredSubscribers = subscribers.filter(sub => 
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        
        <div className="flex-1 overflow-auto">
          <main className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Subscribers</h1>
                <p className="text-gray-600">Manage your email subscribers</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={handleExportCSV}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center"
                >
                  <DownloadCloud size={20} className="mr-2" />
                  Export CSV
                </button>
                {selectedSubscribers.length > 0 && (
                  <button 
                    onClick={handleBulkDelete}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md flex items-center"
                  >
                    <Trash2 size={20} className="mr-2" />
                    Delete Selected ({selectedSubscribers.length})
                  </button>
                )}
              </div>
            </div>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search subscribers by email..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-lg">Loading subscribers...</p>
              </div>
            ) : subscribers.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold mb-4">No Subscribers Found</h3>
                <p className="text-gray-600">You don't have any subscribers yet.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectAll}
                              onChange={handleSelectAll}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Subscribed</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSubscribers.map((subscriber) => (
                        <tr key={subscriber._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedSubscribers.includes(subscriber._id)}
                                onChange={() => handleSelectSubscriber(subscriber._id)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Mail size={16} className="text-gray-400 mr-3" />
                              <span className="text-sm text-gray-900">{subscriber.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${subscriber.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {subscriber.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(subscriber.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDelete(subscriber._id)}
                              disabled={isDeleting && deleteId === subscriber._id}
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
                <div className="px-6 py-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Showing {filteredSubscribers.length} of {subscribers.length} subscribers
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
