import { Link } from 'react-router-dom';
import { Post } from '@/types/post';
import { format } from 'date-fns';

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block animate-fade-in"
    >
      <article className="overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {post.image_url && (
          <div className="aspect-[16/10] overflow-hidden">
            <img
              src={post.image_url}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        <div className="p-6">
          <time className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {format(new Date(post.created_at), 'MMMM d, yyyy')}
          </time>
          <h3 className="mt-2 font-serif text-xl font-semibold text-card-foreground leading-snug group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
            {post.content.replace(/[#*_`>\-\[\]]/g, '').slice(0, 150)}...
          </p>
        </div>
      </article>
    </Link>
  );
}
