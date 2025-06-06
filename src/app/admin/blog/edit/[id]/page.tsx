"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import Sidebar from "@/components/admin/Sidebar";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Save, ArrowLeft, Image } from "lucide-react";
import { BlogPost } from "@/types";
import { fetchWithAuth } from "@/lib/api";

export default function EditBlogPostPage() {
  // Use Next.js useParams hook instead of accepting params as a prop
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    date: "",
    isPublished: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        const data = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/blog/id/${id}`
        );

        // Format date for the input field (yyyy-mm-dd)
        let formattedDate = data.data.date;
        if (formattedDate && !formattedDate.includes("-")) {
          try {
            const dateObj = new Date(formattedDate);
            formattedDate = dateObj.toISOString().split("T")[0];
          } catch (e) {
            console.error("Error formatting date:", e);
          }
        }

        setFormData({
          title: data.data.title || "",
          slug: data.data.slug || "",
          excerpt: data.data.excerpt || "",
          content: data.data.content || "",
          image: data.data.image || "",
          date: formattedDate || "",
          isPublished: data.data.isPublished,
        });
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setError("Failed to load blog post. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogPost();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Update the blog post
      await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/blog/id/${id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      // Redirect to blog posts listing page
      router.push("/admin/blog");
    } catch (error) {
      console.error("Error updating blog post:", error);
      setError("Failed to update blog post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xl">Loading blog post...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />

        <div className="flex-1 overflow-auto">
          <main className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <Link
                  href="/admin/blog"
                  className="mr-4 p-2 hover:bg-gray-200 rounded-full"
                >
                  <ArrowLeft size={20} />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    Edit Blog Post
                  </h1>
                  <p className="text-gray-600">Update your blog post</p>
                </div>
              </div>
            </div>

            {error && (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
                role="alert"
              >
                <p>{error}</p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="slug"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Slug *
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The slug will be used in the URL: /blog/{formData.slug}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="excerpt"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Excerpt *
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  A short description of the blog post that will appear in
                  previews.
                </p>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Content *
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, content }))
                  }
                  height={400}
                  placeholder="Write your blog content here..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use the editor toolbar to format your content, add links, and
                  insert media.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Featured Image URL *
                  </label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the URL of the image (recommended: use the Media
                    Uploads section first)
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <div className="mt-6">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="isPublished"
                        checked={formData.isPublished}
                        onChange={handleCheckboxChange}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Published
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  href="/admin/blog"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium text-white flex items-center"
                >
                  <Save size={18} className="mr-2" />
                  {submitting ? "Saving..." : "Update Post"}
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
