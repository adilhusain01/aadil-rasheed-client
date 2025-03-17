import Image from "next/image";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";

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
  },
];

export default function Home() {
  return (
    <PageTransition>
      <div className="w-full mx-auto">
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:py-12">
            <div className="relative h-[450] md:h-[900px] w-full">
              <Image
                src="https://res.cloudinary.com/djxuqljgr/image/upload/v1742238011/vaibhav-raina-ZrwFg0uPXtk-unsplash_qcywlx.jpg"
                alt="Person lying on grass"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col items-center justify-center px-4">
              {/* <h2 className="text-3xl font-serif mb-4">My Thoughts</h2> */}
              <h2 className="text-3xl font-serif mb-4">मेरी क़लम से </h2>
              <div className="max-w-[440px] mb-6 flex flex-col items-center  justify-center">
                <Image
                  // src="https://ext.same-assets.com/2530339430/2737161437.jpeg"
                  src="https://res.cloudinary.com/djxuqljgr/image/upload/v1742233800/image_tqophb.jpg"
                  alt="Detoxing my social media feed"
                  width={440}
                  height={440}
                  className="mb-4 shadow-md"
                />
                <Link
                  href="/blog/detoxing-my-social-media-feed"
                  className="block"
                >
                  {/* <h3 className="text-xl font-serif hover:text-primary transition-colors mb-2">
                    Detoxing my social media feed
                  </h3> */}
                  <h3 className="text-xl font-serif hover:text-primary transition-colors mb-2">
                    पहली मोहब्बत, पहली मोहब्बत होती है
                  </h3>
                  {/* <p className="text-sm text-muted-foreground mb-4">
                    Create a blog post subtitle that summarizes your post in a
                    few short, punchy sentences and entices your audience to
                    continue reading...
                  </p> */}
                </Link>
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
          <div className="w-full flex flex-col items-center justify-center px-4">
            <div className="py-12 max-w-4xl">
              <h2 className="text-5xl font-serif mb-8">Recent Posts</h2>
              <div className="grid grid-cols-1 gap-8 justify-items-center">
                {blogPosts.slice(0, 3).map((post, index) => (
                  <div
                    key={index}
                    className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <div className="relative h-[350px] w-full mb-4 overflow-hidden group">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="text-2xl font-serif hover:text-primary transition-colors mb-2 ">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{post.views} views</span>
                        <span>{post.likes} likes</span>
                      </div>
                    </div>
                  </div>
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

        {/* <AnimatedSection delay={0.5}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12">
            <div className="relative h-[400px] w-full">
              <Image
                src="https://ext.same-assets.com/1073646692/524880185.jpeg"
                alt="Dena portrait"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-serif mb-4">Hi, I'm Dena</h2>
              <p className="mb-4">
                A mental health blogger. Passionate about sharing thoughts and
                information on everything that makes my days better.
              </p>
              <p className="mb-6">
                I'm a paragraph. Click here to add your own text and edit me.
                Its easy. Just click Edit Text or double click me to add your
                own content and make changes to the font. Feel free to drag and
                drop me anywhere you like on your page. Im a great place for you
                to tell a story and let your users know a little more about you.
              </p>
              <Link
                href="/about"
                className="border border-gray-300 w-fit px-5 py-2 text-sm hover:bg-primary hover:text-white hover:border-primary transition-colors"
              >
                Read More
              </Link>
            </div>
          </div>
        </AnimatedSection> */}

        <AnimatedSection delay={0.6}>
          <div className="py-12 px-4 md:px-12">
            <h2 className="text-3xl font-serif mb-8 text-center">
              Some Moments from past
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                "https://res.cloudinary.com/djxuqljgr/image/upload/v1742233800/image_tqophb.jpg",
                "https://res.cloudinary.com/djxuqljgr/image/upload/v1742234779/imagr2_l80wqe.jpg",
                "https://res.cloudinary.com/djxuqljgr/image/upload/v1742236807/image3_dak6e6.jpg",
                "https://res.cloudinary.com/djxuqljgr/image/upload/v1742237648/4_reuuyf.jpg",
                "https://res.cloudinary.com/djxuqljgr/image/upload/v1742237648/3_l63y7r.jpg",
                "https://res.cloudinary.com/djxuqljgr/image/upload/v1742237647/2_bqzsdp.jpg",
              ].map((image, index) => (
                <div
                  key={index}
                  className="relative h-[400px] overflow-hidden group"
                >
                  <Image
                    src={image}
                    alt={`Smile gallery ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
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
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="border-b border-gray-300 py-2 px-2 w-full focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="border-b border-gray-300 py-2 px-2 w-full focus:outline-none focus:border-primary"
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="border-b border-gray-300 py-2 px-2 w-full focus:outline-none focus:border-primary"
              />
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="subscribe" className="h-4 w-4" />
                <label htmlFor="subscribe" className="text-sm">
                  Yes, subscribe to the newsletter.
                </label>
              </div>
              <button
                type="submit"
                className="bg-gray-200 text-gray-800 px-6 py-2 hover:bg-gray-300 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
}
