"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
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
            href="mailto:aadilrasheed02@gmail.com"
            className="text-sm hover:underline"
          >
            aadilrasheed02@gmail.com
          </Link>
          <p className="text-xs mt-4">© 2025 by Void Orbits</p>
        </div>
        <div>
          <h3 className="text-xl font-serif mb-4">Contact</h3>
          <p className="text-sm mb-4">Ask me anything</p>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full bg-transparent border-b border-white/30 py-2 text-sm focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full bg-transparent border-b border-white/30 py-2 text-sm focus:outline-none focus:border-white"
                />
              </div>
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-transparent border-b border-white/30 py-2 text-sm focus:outline-none focus:border-white"
              />
            </div>
            <div>
              <textarea
                placeholder="Leave Us a Message..."
                rows={3}
                className="w-full bg-transparent border-b border-white/30 py-2 text-sm focus:outline-none focus:border-white resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="border border-white px-6 py-2 text-sm hover:bg-white hover:text-zinc-800 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
