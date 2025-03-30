import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";
import BlogCard from "@/components/blog/BlogCard";
import { fetchBlogPosts } from "@/lib/api";
import { BlogPost } from "./[slug]/page";

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    return await fetchBlogPosts();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();
  return (
    <PageTransition>
      <section className="mt-[5rem] px-4">
        <div className="w-full max-w-5xl mx-auto">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-serif mb-12">Blog Posts</h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="grid grid-cols-1 gap-12">
              {blogPosts.map((post: BlogPost, index: number) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageTransition>
  );
}
