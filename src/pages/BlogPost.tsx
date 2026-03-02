import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types/post';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
      .then(({ data }) => {
        setPost(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-2xl space-y-4">
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="h-12 w-full animate-pulse rounded bg-muted" />
            <div className="h-64 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground">Post not found</h1>
          <Link to="/blog" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <article className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>

          <header className="mb-10">
            <time className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {format(new Date(post.created_at), 'MMMM d, yyyy')}
            </time>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl">
              {post.title}
            </h1>
          </header>

          {post.image_url && (
            <div className="mb-10 overflow-hidden rounded-lg">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
}
