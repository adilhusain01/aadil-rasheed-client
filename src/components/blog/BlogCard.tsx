import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/api";

interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

export default function BlogCard({ post, className = "" }: BlogCardProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      <Link href={`/blog/${post.slug}`}>
        <div className="relative h-[350px] w-full mb-4 overflow-hidden group">
          <Image
            src={post.image || '/images/placeholder-blog.jpg'}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="flex flex-col gap-2">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
          <span>{post.date}</span>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-2xl font-serif hover:text-primary transition-colors mb-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{post.likes} likes</span>
        </div>
      </div>
    </div>
  );
}
