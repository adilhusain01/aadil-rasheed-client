"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import Sidebar from "@/components/admin/Sidebar";
import { FileText, Image, Instagram, Mail, Users } from "lucide-react";

// Card component for dashboard stats
const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = "bg-blue-500" 
}: { 
  title: string; 
  value: number | string; 
  icon: React.ReactNode; 
  color?: string; 
}) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
    <div className={`${color} p-3 rounded-full mr-4 text-white`}>
      {icon}
    </div>
    <div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState({
    blogPosts: 0,
    galleryImages: 0,
    socialLinks: 0,
    messages: 0,
    subscribers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch blog posts count
        const blogRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`, {
          credentials: 'include',
        });
        const blogData = await blogRes.json();
        
        // Fetch gallery images count
        const galleryRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`, {
          credentials: 'include',
        });
        const galleryData = await galleryRes.json();
        
        // Fetch social media links count
        const socialRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/social`, {
          credentials: 'include',
        });
        const socialData = await socialRes.json();
        
        // Fetch contact messages count
        const contactRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
          credentials: 'include',
        });
        const contactData = await contactRes.json();
        
        // Fetch subscribers count
        const subsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription`, {
          credentials: 'include',
        });
        const subsData = await subsRes.json();
        
        setStats({
          blogPosts: blogData.count || 0,
          galleryImages: galleryData.count || 0,
          socialLinks: socialData.count || 0,
          messages: contactData.count || 0,
          subscribers: subsData.count || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        
        <div className="flex-1 overflow-auto">
          <main className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600">Overview of your website content</p>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-lg">Loading stats...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <StatCard 
                    title="Blog Posts" 
                    value={stats.blogPosts} 
                    icon={<FileText size={24} />} 
                    color="bg-blue-500" 
                  />
                  <StatCard 
                    title="Gallery Images" 
                    value={stats.galleryImages} 
                    icon={<Image size={24} />} 
                    color="bg-green-500" 
                  />
                  <StatCard 
                    title="Social Media Links" 
                    value={stats.socialLinks} 
                    icon={<Instagram size={24} />} 
                    color="bg-purple-500" 
                  />
                  <StatCard 
                    title="Messages" 
                    value={stats.messages} 
                    icon={<Mail size={24} />} 
                    color="bg-yellow-500" 
                  />
                  <StatCard 
                    title="Subscribers" 
                    value={stats.subscribers} 
                    icon={<Users size={24} />} 
                    color="bg-red-500" 
                  />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                  <p className="text-gray-600">
                    Welcome to your admin dashboard! From here, you can manage all aspects of your website content.
                    Use the sidebar navigation to access different sections of the admin panel.
                  </p>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-bold text-lg mb-2">Quick Tips</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Add new blog posts from the Blog Posts section</li>
                        <li>Upload new gallery images from the Gallery section</li>
                        <li>Manage social media links from the Social Media section</li>
                        <li>View and respond to contact messages from the Messages section</li>
                        <li>Manage your subscriber list from the Subscribers section</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h3 className="font-bold text-lg mb-2">Getting Started</h3>
                      <p className="text-sm">
                        To get started with managing your content, click on any of the sections in 
                        the sidebar to navigate to the respective management page. From there, 
                        you can add, edit, or delete content as needed.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
