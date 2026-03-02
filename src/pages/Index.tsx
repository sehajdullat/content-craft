import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types/post';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import heroBg from '@/assets/hero-bg.jpg';

export default function Index() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        setPosts(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-background/70" />
        </div>
        <div className="container relative mx-auto px-4 py-28 md:py-40">
          <h1 className="max-w-2xl font-serif text-5xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl animate-fade-in">
            Stories that <span className="text-primary">inspire</span>.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: '0.15s' }}>
            Thoughtful writing on design, technology, and the human experience.
          </p>
          <Link
            to="/blog"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            Read the blog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">Latest Posts</h2>
            <p className="mt-2 text-muted-foreground">Fresh perspectives, freshly published.</p>
          </div>
          <Link to="/blog" className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">No posts yet. Check back soon!</p>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link to="/blog" className="text-sm font-medium text-primary hover:underline">
            View all posts →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
