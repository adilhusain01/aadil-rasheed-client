import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";

type PageParams = {
  params: {
    slug: string;
  };
};

// Define blog post data
const blogPosts = [
  {
    title:
      "हम पे लाज़िम है कि हम वक़्त को ज़ाया न करें, आज की क़द्र करेंगे तो ही कल बनता है",
    slug: "ham-pe-laazim-hai-ki-ham-waqt-ko-zaaya-na-karein",
    excerpt:
      "हम पे लाज़िम है कि हम वक़्त को ज़ाया न करें, आज की क़द्र करेंगे तो ही कल बनता है ...",
    image:
      "https://res.cloudinary.com/djxuqljgr/image/upload/v1742234779/imagr2_l80wqe.jpg",
    date: "December 6, 2024",
    readTime: "2 min read",
    views: 1468,
    likes: 31,
    content: `
       <p>हम पे लाज़िम है कि हम वक़्त को ज़ाया न करें</p>
      <p>आज की क़द्र करेंगे तो ही कल बनता है</p>
      <p>तपना पड़ता है मुक़द्दर को बनाने के लिए</p>
      <p>खारा पानी तभी बरसात का जल बनता है</p>
      <p>उम्र लगती है तो लहजा ए ग़ज़ल बनता है</p>
      <p>एक दो दिन में कहीं ताजमहल बनता है</p>
      <p>उसने इल्ज़ाम लगाया तो ये हक़ है मेरा</p>
      <p>यार अहसान का इतना तो बदल बनता है</p>  
    `,
  },
];

// Generate static params for all blog posts
export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: PageParams) {
  const post = blogPosts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <PageTransition>
      <section className="mt-[5rem] ">
        <div className="w-full max-w-5xl mx-auto py-4">
          <Link href="/blog" className="hover:text-primary transition-colors">
            All posts
          </Link>
        </div>
        <div className="w-full max-w-5xl mx-auto px-4 py-12 border-[1px]">
          <article className="w-full max-w-3xl mx-auto">
            <AnimatedSection>
              <header className="mb-10">
                <div className="flex items-center justify-start space-x-3 mb-8">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                    A
                  </div>
                  <div className="flex flex-row items-center justify-start gap-2">
                    <span className="text-sm font-medium">Admin</span>
                    <div className="text-xs text-muted-foreground space-x-1">
                      <span>•</span>
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
                <div className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">
                    {post.title}
                  </h1>
                  <p className="font-semibold">{post.excerpt}</p>
                </div>

                <div className="relative w-full h-[400px] mb-8">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </header>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div
                className="prose prose-stone max-w-none mb-10 space-y-5"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="border-t border-gray-200 pt-6 mt-10">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {post.views} views
                  </div>
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-5 h-5 text-muted-foreground"
                      >
                        <path
                          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                      <span className="text-sm text-muted-foreground">
                        {post.likes}
                      </span>
                    </button>
                    <button className="flex items-center space-x-1">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-5 h-5 text-muted-foreground"
                      >
                        <path
                          d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                      <span className="text-sm text-muted-foreground">0</span>
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="border-t border-gray-200 py-10 mt-10">
                <h3 className="text-xl font-serif mb-6">Related Posts</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {blogPosts
                    .filter((p) => p.slug !== post.slug)
                    .slice(0, 3)
                    .map((relatedPost, index) => (
                      <div key={index} className="group">
                        <Link href={`/blog/${relatedPost.slug}`}>
                          <div className="relative h-[200px] w-full mb-3 overflow-hidden">
                            <Image
                              src={relatedPost.image}
                              alt={relatedPost.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>
                          <h4 className="text-md font-serif hover:text-primary transition-colors">
                            {relatedPost.title}
                          </h4>
                        </Link>
                      </div>
                    ))}
                </div>
              </div>
            </AnimatedSection>
          </article>
        </div>
      </section>
    </PageTransition>
  );
}
