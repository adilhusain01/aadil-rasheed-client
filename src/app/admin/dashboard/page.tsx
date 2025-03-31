"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import Sidebar from "@/components/admin/Sidebar";
import { FileText, Image, AtSign, MessageSquare, Users, MailOpen } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";

// Card component for dashboard stats
function StatCard({ 
  title, 
  value, 
  icon, 
  color = "bg-blue-500" 
}: { 
  title: string; 
  value: number | string; 
  icon: React.ReactNode; 
  color?: string; 
}) {
  return (
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
};

export default function DashboardPage() {
  const [stats, setStats] = useState({
    blogPosts: {
      total: 0,
      published: 0,
      unpublished: 0
    },
    galleryImages: 0,
    socialLinks: {
      total: 0,
      active: 0,
      inactive: 0
    },
    messages: 0,
    subscribers: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Fetch blog posts count
      const blogData = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/blog/admin/all`);
      
      // Fetch gallery images count
      const galleryData = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/gallery`);
      
      // Fetch social media links count
      const socialData = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/social/admin/all`);
      
      // Fetch contact messages count
      const contactData = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/contact`);
      
      // Fetch subscribers count
      const subsData = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/subscription`);
      
      setStats({
        blogPosts: {
          total: blogData.count || 0,
          published: blogData.publishedCount || 0,
          unpublished: blogData.unpublishedCount || 0
        },
        galleryImages: galleryData.count || 0,
        socialLinks: {
          total: socialData.count || 0,
          active: socialData.activeCount || 0,
          inactive: socialData.inactiveCount || 0
        },
        messages: contactData.count || 0,
        subscribers: subsData.count || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
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
                    value={`${stats.blogPosts.published} published / ${stats.blogPosts.unpublished} drafts`} 
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
                    value={`${stats.socialLinks.active} active / ${stats.socialLinks.inactive} inactive`} 
                    icon={<AtSign size={24} />} 
                    color="bg-purple-500" 
                  />
                  <StatCard 
                    title="Messages" 
                    value={stats.messages} 
                    icon={<MailOpen size={24} />} 
                    color="bg-yellow-500" 
                  />
                  <StatCard 
                    title="Subscribers" 
                    value={stats.subscribers} 
                    icon={<Users size={24} />} 
                    color="bg-red-500" 
                  />
                </div>

                {/* <div className="bg-white rounded-lg shadow-md p-6">
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
                </div> */}
              </>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
