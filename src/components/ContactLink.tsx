"use client";

import { ReactNode } from "react";

interface ContactLinkProps {
  children: ReactNode;
  className?: string;
}

export default function ContactLink({ children, className }: ContactLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <a
      href="#contact"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
