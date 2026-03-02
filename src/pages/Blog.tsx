import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types/post';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPosts(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <header className="mb-12">
          <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl">Blog</h1>
          <p className="mt-3 text-lg text-muted-foreground">All published articles.</p>
        </header>

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
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
          <p className="text-center text-muted-foreground py-20">No posts published yet.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
