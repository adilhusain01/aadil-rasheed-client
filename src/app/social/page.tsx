"use client";

import { useEffect } from "react";
import InstagramEmbed from "@/components/InstagramEmbed";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";

export default function SocialPage() {
  useEffect(() => {
    // Load Instagram script dynamically
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <PageTransition>
      <div className="w-full mt-[5rem] max-w-7xl mx-auto px-4 md:py-12 flex flex-col items-center justify-center">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-serif mb-6">Social Media</h1>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <div className="max-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <InstagramEmbed url="https://www.instagram.com/reel/DG3G0vZzONi/?utm_source=ig_embed&amp;utm_campaign=loading" />
            <InstagramEmbed url="https://www.instagram.com/reel/CvHvIy0JKz1/?utm_source=ig_embed&amp;utm_campaign=loading" />
            <InstagramEmbed url="https://www.instagram.com/reel/DHGLv8oIfh_/?utm_source=ig_embed&amp;utm_campaign=loading" />
            <InstagramEmbed url="https://www.instagram.com/reel/DHBiGO2Twpl/?utm_source=ig_embed&amp;utm_campaign=loading" />
            <InstagramEmbed url="https://www.instagram.com/reel/DG8bsq4TZx9/?utm_source=ig_embed&amp;utm_campaign=loading" />
            <InstagramEmbed url="https://www.instagram.com/reel/DFXozAsTC7A/?utm_source=ig_embed&amp;utm_campaign=loading" />
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.5}>
          <div className="bg-stone-100 p-8 rounded-lg text-center mb-16">
            <h2 className="text-2xl font-serif mb-4">
              Follow Me on Social Media
            </h2>
            <div className="flex justify-center space-x-8">
              <a
                href="https://www.instagram.com/p/DHQtTLrz5Le/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center hover:text-primary transition-colors"
              >
                <span className="text-3xl mb-2">📸</span>
                <span>Instagram</span>
              </a>
              <a
                href="https://www.facebook.com/poetaadilrasheed"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center hover:text-primary transition-colors"
              >
                <span className="text-3xl mb-2">🐦</span>
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
}
