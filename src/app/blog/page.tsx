import Image from "next/image";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";

// Define blog post data
const blogPosts = [
  {
    title: "हम पे लाज़िम है कि हम वक़्त को ज़ाया न करें",
    slug: "ham-pe-laazim-hai-ki-ham-waqt-ko-zaaya-na-karein",
    excerpt:
      "हम पे लाज़िम है कि हम वक़्त को ज़ाया न करें, आज की क़द्र करेंगे तो ही कल बनता है ...",
    image:
      "https://res.cloudinary.com/djxuqljgr/image/upload/v1742234779/imagr2_l80wqe.jpg",
    date: "May 1, 2023",
    readTime: "2 min read",
    views: 1468,
    likes: 31,
  },
];

export default function BlogPage() {
  return (
    <PageTransition>
      <div className="mt-[5rem] w-full max-w-7xl mx-auto px-4 md:py-12">
        <AnimatedSection>
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif mb-6">Blog</h1>
            <div className="flex justify-center">
              <div className="flex space-x-6">
                <Link
                  href="/blog"
                  className="text-primary hover:opacity-80 transition-opacity text-sm font-medium"
                >
                  All Posts
                </Link>
              </div>
            </div>
            {/* <div className="flex justify-end mt-4">
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Log in / Sign up
              </Link>
            </div> */}
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
          {blogPosts.map((post, index) => (
            <AnimatedSection key={index} delay={0.1 * (index % 4)}>
              <div className="relative">
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative h-[340px] w-full mb-4 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex justify-center items-center text-xs">
                    A
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-muted-foreground">Admin</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  {/* <button className="ml-auto">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-5 h-5 text-muted-foreground"
                    >
                      <path
                        d="M12 12V12.01M8 12V12.01M16 12V12.01M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </button> */}
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-serif mb-2 hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-sm text-muted-foreground mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.views} views</span>
                  <button className="flex items-center space-x-1">
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                      <path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                    <span>{post.likes}</span>
                  </button>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
