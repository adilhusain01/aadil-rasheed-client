"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const [showHeaderFooter, setShowHeaderFooter] = useState(true);
  
  useEffect(() => {
    // Don't show header and footer on admin pages or login page
    const isAdminPage = pathname?.startsWith('/admin');
    const isLoginPage = pathname === '/login';
    setShowHeaderFooter(!isAdminPage && !isLoginPage);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {showHeaderFooter && <Header />}
      <main className={`flex-1 ${showHeaderFooter ? 'pt-4 md:pt-16' : ''}`}>
        {children}
      </main>
      {showHeaderFooter && (
        <div id="contact">
          <Footer />
        </div>
      )}
    </div>
  );
}
