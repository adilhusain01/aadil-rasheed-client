import Image from "next/image";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";
import BlogCard from "@/components/blog/BlogCard";
import { fetchBlogPosts, fetchGalleryImages } from "@/lib/api";
import SubscriptionForm from "@/components/SubscriptionForm";
import { BlogPost } from "./blog/[slug]/page";

// Interface for Gallery Images
interface GalleryImage {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    return await fetchBlogPosts();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    return await fetchGalleryImages();
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
}

export default async function Home() {
  const blogPosts = await getBlogPosts();
  const galleryImages = await getGalleryImages();
  
  // Fallback gallery images in case API fails
  const fallbackImages = [
    "https://res.cloudinary.com/djxuqljgr/image/upload/v1742233800/image_tqophb.jpg",
    "https://res.cloudinary.com/djxuqljgr/image/upload/v1742234779/imagr2_l80wqe.jpg",
    "https://res.cloudinary.com/djxuqljgr/image/upload/v1742236807/image3_dak6e6.jpg",
    "https://res.cloudinary.com/djxuqljgr/image/upload/v1742237648/4_reuuyf.jpg",
    "https://res.cloudinary.com/djxuqljgr/image/upload/v1742237648/3_l63y7r.jpg",
    "https://res.cloudinary.com/djxuqljgr/image/upload/v1742237647/2_bqzsdp.jpg",
  ];
  
  // If no gallery images, use fallback
  const displayImages = galleryImages.length > 0 
    ? galleryImages.map(img => img.imageUrl) 
    : fallbackImages;
  return (
    <PageTransition>
      <div className="w-full mx-auto">
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:py-12">
            <div className="relative h-[450px] md:h-[900px] w-full">
              <Image
                src="https://res.cloudinary.com/djxuqljgr/image/upload/v1742238011/vaibhav-raina-ZrwFg0uPXtk-unsplash_qcywlx.jpg"
                alt="Person lying on grass"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col items-center justify-center px-4">
              <h2 className="text-3xl font-serif mb-4">मेरी क़लम से </h2>
              <div className="max-w-[440px] mb-6 flex flex-col items-center justify-center">
                <Image
                  src="https://res.cloudinary.com/djxuqljgr/image/upload/v1742233800/image_tqophb.jpg"
                  alt="Detoxing my social media feed"
                  width={440}
                  height={440}
                  className="mb-4 shadow-md"
                />
                <div
                  className="block"
                >
                  <h3 className="text-xl font-serif hover:text-primary transition-colors mb-2">
                    पहली मोहब्बत, पहली मोहब्बत होती है
                  </h3>
                </div>
                <Link
                  href="/blog"
                  className="border border-gray-300 px-5 py-2 text-sm hover:bg-primary hover:text-white hover:border-primary transition-colors"
                >
                  All Posts
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div className="w-full px-4">
            <div className="py-12 max-w-6xl mx-auto">
              <h2 className="text-5xl font-serif mb-8">Recent Posts</h2>
              <div className="grid grid-cols-1 gap-12">
                {blogPosts.slice(0, 3).map((post: BlogPost) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <div className="py-8 bg-stone-100 px-8 my-12">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/2 flex flex-col items-center justify-center">
                <blockquote className="text-3xl md:text-5xl font-serif italic text-gray-700">
                  ❝ उनको सीने से लगा जो हैं मुख़ालिफ़ तेरे ❞
                </blockquote>
                <p className="mt-4 text-lg text-muted-foreground">
                  — Aadil Rasheed
                </p>
              </div>
              <div className="md:w-1/2 relative w-full h-[350px] md:h-[1000px]">
                <Image
                  src="https://res.cloudinary.com/djxuqljgr/image/upload/v1742236807/image3_dak6e6.jpg"
                  alt="Quote background"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.6}>
          <div className="py-12 px-4 md:px-12">
            <h2 className="text-3xl font-serif mb-8 text-center">
              Some Moments from past
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {displayImages.map((image, index) => (
                <div
                  key={index}
                  className="relative h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] overflow-hidden group"
                >
                  <Image
                    src={image}
                    alt={`Smile gallery ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.7}>
          <div className="py-12 max-w-2xl mx-auto text-center px-4">
            <h2 className="text-3xl font-serif mb-4">Join the Updates</h2>
            <p className="text-muted-foreground mb-8">Get the latest posts</p>
            <SubscriptionForm />
          </div>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
}
