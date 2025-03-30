"use client";

import { useState, useEffect, useRef } from "react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import Sidebar from "@/components/admin/Sidebar";
import { Upload, Trash2, Copy, Image, FileText, File, X, Search, ExternalLink } from "lucide-react";

interface MediaFile {
  _id: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  url: string;
  createdAt: string;
}

export default function UploadsPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState<MediaFile | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMediaFiles = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch media files');
      }
      
      const data = await res.json();
      setMediaFiles(data.data);
    } catch (error) {
      console.error('Error fetching media files:', error);
      setError('Failed to load media files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const formData = new FormData();
    
    // Add all selected files to the form data
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    
    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);
      
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      });
      
      xhr.onload = async () => {
        if (xhr.status === 200 || xhr.status === 201) {
          try {
            const data = JSON.parse(xhr.responseText);
            
            if (data.success) {
              // Refresh the media files list
              await fetchMediaFiles();
              
              // Reset the file input
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            } else {
              throw new Error(data.error || 'Upload failed');
            }
          } catch (error) {
            console.error('Error parsing response:', error);
            setError('Failed to upload files. Please try again.');
          }
        } else {
          console.error('Upload failed with status:', xhr.status);
          setError(`Upload failed with status ${xhr.status}`);
        }
        
        setUploading(false);
        setUploadProgress(0);
      };
      
      xhr.onerror = () => {
        console.error('Upload request failed');
        setError('Upload request failed. Please check your connection and try again.');
        setUploading(false);
        setUploadProgress(0);
      };
      
      xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL}/upload`, true);
      xhr.withCredentials = true;
      xhr.send(formData);
      
    } catch (error) {
      console.error('Error uploading files:', error);
      setError('Failed to upload files. Please try again.');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        setDeleteId(id);
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        
        if (!res.ok) {
          throw new Error('Failed to delete file');
        }
        
        // Remove the deleted file from the state
        setMediaFiles(prevFiles => prevFiles.filter(file => file._id !== id));
      } catch (error) {
        console.error('Error deleting file:', error);
        setError('Failed to delete file. Please try again.');
      } finally {
        setIsDeleting(false);
        setDeleteId(null);
      }
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedUrl(null);
    }, 2000);
  };

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith('image/')) {
      return <Image size={20} className="text-green-500" />;
    } else if (mimetype.startsWith('text/')) {
      return <FileText size={20} className="text-blue-500" />;
    } else {
      return <File size={20} className="text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  // Filter files based on search term
  const filteredFiles = mediaFiles.filter(file => 
    file.originalname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        
        <div className="flex-1 overflow-auto">
          <main className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Media Uploads</h1>
                <p className="text-gray-600">Manage your uploaded files</p>
              </div>
              <label className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center cursor-pointer">
                <Upload size={20} className="mr-2" />
                Upload Files
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                  disabled={uploading}
                />
              </label>
            </div>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            {uploading && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-blue-700">Uploading...</span>
                  <span className="text-sm font-medium text-blue-700">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search files by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-lg">Loading media files...</p>
              </div>
            ) : mediaFiles.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold mb-4">No Media Files Found</h3>
                <p className="text-gray-600 mb-6">You haven't uploaded any files yet.</p>
                <label className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md inline-flex items-center cursor-pointer">
                  <Upload size={20} className="mr-2" />
                  Upload Your First File
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredFiles.map((file) => (
                        <tr key={file._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getFileIcon(file.mimetype)}
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                  {file.originalname}
                                </div>
                                <div className="text-xs text-gray-500 truncate max-w-xs">
                                  {file.filename}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatFileSize(file.size)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {file.mimetype}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(file.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              {file.mimetype.startsWith('image/') && (
                                <button
                                  onClick={() => setShowImagePreview(file)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  <Image size={18} />
                                </button>
                              )}
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <ExternalLink size={18} />
                              </a>
                              <button
                                onClick={() => handleCopyUrl(file.url)}
                                className={`${copiedUrl === file.url ? 'text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
                              >
                                <Copy size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(file._id)}
                                disabled={isDeleting && deleteId === file._id}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Showing {filteredFiles.length} of {mediaFiles.length} files
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* Image Preview Modal */}
      {showImagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh] overflow-auto">
            <button
              onClick={() => setShowImagePreview(null)}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              <X size={20} />
            </button>
            <img
              src={showImagePreview.url}
              alt={showImagePreview.originalname}
              className="max-w-full h-auto"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
              <h3 className="text-lg font-semibold">{showImagePreview.originalname}</h3>
              <div className="flex justify-between mt-2">
                <span>{formatFileSize(showImagePreview.size)}</span>
                <button
                  onClick={() => handleCopyUrl(showImagePreview.url)}
                  className="text-blue-300 hover:text-blue-100 flex items-center"
                >
                  <Copy size={16} className="mr-1" />
                  {copiedUrl === showImagePreview.url ? 'Copied!' : 'Copy URL'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
