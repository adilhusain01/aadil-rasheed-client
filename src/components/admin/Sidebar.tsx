"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  FileText, 
  Image, 
  Instagram, 
  Mail, 
  Users, 
  Upload, 
  Home, 
  LogOut 
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { path: "/admin/blog", label: "Blog Posts", icon: <FileText size={20} /> },
    { path: "/admin/comments", label: "Comments", icon: <Upload size={20} /> },
    { path: "/admin/gallery", label: "Gallery", icon: <Image size={20} /> },
    { path: "/admin/social", label: "Social Media", icon: <Instagram size={20} /> },
    { path: "/admin/messages", label: "Messages", icon: <Mail size={20} /> },
    { path: "/admin/subscribers", label: "Subscribers", icon: <Users size={20} /> },
    { path: "/admin/uploads", label: "Media Uploads", icon: <Upload size={20} /> },
  ];

  const isActive = (path: string) => {
    if (path === "/admin/dashboard") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/admin/login";
  };

  return (
    <div className="h-screen flex flex-col bg-gray-800 text-white w-64 py-8 px-4">
      <div className="mb-8">
        <h2 className="text-xl font-serif font-bold">Admin Dashboard</h2>
        <p className="text-sm text-gray-400">Welcome, {user?.name}</p>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center px-4 py-2 rounded-md ${
                  isActive(item.path)
                    ? "bg-gray-700"
                    : "hover:bg-gray-700 transition-colors"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="pt-6 border-t border-gray-700 mt-6">
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 w-full text-left rounded-md hover:bg-gray-700 transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
        <Link
          href="/"
          className="flex items-center mt-2 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          <span className="mr-3">🌐</span>
          View Website
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
