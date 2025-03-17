"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import ContactLink from "./ContactLink";

export default function StickyHeader() {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [show, setShow] = useState(true);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        // Only hide header after scrolling down 100px
        if (window.scrollY > 100) {
          if (window.scrollY > lastScrollY) {
            // Scrolling down
            setShow(false);
          } else {
            // Scrolling up
            setShow(true);
          }
        } else {
          setShow(true);
        }

        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener("scroll", controlNavbar);

    // Cleanup event listener
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 w-full z-50 bg-background/95 backdrop-blur-sm shadow-sm`}
      initial={{ y: 0 }}
      animate={{ y: show ? 0 : -110 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto px-20 py-10">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-serif text-primary">
            Aadil Rasheed
          </Link>
          <nav>
            <ul className="flex space-x-6 items-center">
              <li>
                <Link
                  href="/"
                  className={cn(
                    "text-md font-sans hover:text-primary transition-colors",
                    isActive("/") ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className={cn(
                    "text-md font-sans hover:text-primary transition-colors",
                    isActive("/blog") ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Blog
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/about"
                  className={cn(
                    "text-md font-sans hover:text-primary transition-colors",
                    isActive("/about")
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  About
                </Link>
              </li> */}
              {/* <li>
                <Link
                  href="/resources"
                  className={cn(
                    "text-md font-sans hover:text-primary transition-colors",
                    isActive("/resources")
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  Resources
                </Link>
              </li> */}
              <li>
                <Link
                  href="/social"
                  className={cn(
                    "text-md font-sans hover:text-primary transition-colors",
                    isActive("/social")
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  Social
                </Link>
              </li>
              <li>
                <ContactLink className="text-md font-sans hover:text-primary transition-colors text-muted-foreground">
                  Contact
                </ContactLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
