"use client";

import { useState, FormEvent, useRef } from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { submitContactForm } from "@/lib/api";
import ReCaptcha, { ReCaptchaHandle } from "./ReCaptcha";

export default function Footer() {
  const recaptchaRef = useRef<ReCaptchaHandle>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      setSubmitStatus({
        success: false,
        message: "Please fill in all fields"
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Execute reCAPTCHA verification
      const recaptchaToken = await recaptchaRef.current?.executeReCaptcha() || '';
      
      if (!recaptchaToken) {
        throw new Error("Bot verification failed. Please try again.");
      }
      
      await submitContactForm(formData, recaptchaToken);
      setSubmitStatus({
        success: true,
        message: "Thank you for your message! We'll get back to you soon."
      });
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        message: ""
      });
      
      // Reset reCAPTCHA
      recaptchaRef.current?.resetReCaptcha();
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: error instanceof Error 
          ? error.message 
          : "Something went wrong. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <footer className="w-full bg-zinc-800 text-white py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Link
              href="https://www.facebook.com/poetaadilrasheed"
              target="_blank"
              className="hover:opacity-80 transition-opacity"
            >
              <Facebook size={20} />
            </Link>
            {/* <Link
              href="https://www.twitter.com/wix"
              target="_blank"
              className="hover:opacity-80 transition-opacity"
            >
              <Twitter size={20} />
            </Link> */}
            <Link
              href="https://www.instagram.com/aadil_rasheed_official/"
              target="_blank"
              className="hover:opacity-80 transition-opacity"
            >
              <Instagram size={20} />
            </Link>
          </div>
          <h3 className="text-xl font-serif mt-4">Aadil Rasheed</h3>
          {/* <p className="text-sm">123-456-7890</p> */}
          <Link
            href="mailto:poetaadilrasheed@gmail.com"
            className="text-sm hover:underline"
          >
            poetaadilrasheed@gmail.com
          </Link>
          <p className="text-xs mt-4"> 2025 by Void Orbits</p>
        </div>
        <div>
          <h3 className="text-xl font-serif mb-4">Contact</h3>
          <p className="text-sm mb-4">Ask me anything</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/30 py-2 text-sm focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/30 py-2 text-sm focus:outline-none focus:border-white"
                />
              </div>
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white/30 py-2 text-sm focus:outline-none focus:border-white"
              />
            </div>
            <div>
              <textarea
                name="message"
                placeholder="Leave Us a Message..."
                rows={3}
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white/30 py-2 text-sm focus:outline-none focus:border-white resize-none"
              ></textarea>
            </div>
            {submitStatus && (
              <div className={`text-sm ${submitStatus.success ? 'text-green-400' : 'text-red-400'}`}>
                {submitStatus.message}
              </div>
            )}
            
            {/* reCAPTCHA component (invisible) */}
            <ReCaptcha ref={recaptchaRef} />
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="border border-white px-6 py-2 text-sm hover:bg-white hover:text-zinc-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
