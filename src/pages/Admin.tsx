import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types/post';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, LogOut, Upload } from 'lucide-react';

export default function Admin() {
  const { signOut } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Post | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [published, setPublished] = useState(false);

  const fetchPosts = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!editing) setSlug(generateSlug(value));
  };

  const resetForm = () => {
    setTitle(''); setSlug(''); setContent(''); setImageUrl(''); setPublished(false);
    setEditing(null); setShowForm(false);
  };

  const openEdit = (post: Post) => {
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setImageUrl(post.image_url ?? '');
    setPublished(post.published);
    setEditing(post);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('blog-images').upload(fileName, file);
    if (error) {
      toast.error('Upload failed: ' + error.message);
    } else {
      const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName);
      setImageUrl(data.publicUrl);
      toast.success('Image uploaded!');
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!title || !slug || !content) {
      toast.error('Title, slug, and content are required.');
      return;
    }
    setSaving(true);
    const postData = { title, slug, content, image_url: imageUrl || null, published };

    if (editing) {
      const { error } = await supabase.from('posts').update(postData).eq('id', editing.id);
      if (error) toast.error(error.message);
      else { toast.success('Post updated!'); resetForm(); fetchPosts(); }
    } else {
      const { error } = await supabase.from('posts').insert([postData]);
      if (error) toast.error(error.message);
      else { toast.success('Post created!'); resetForm(); fetchPosts(); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Post deleted.'); fetchPosts(); }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
          <div className="flex gap-2">
            <Button onClick={() => { resetForm(); setShowForm(true); }} size="sm">
              <Plus className="h-4 w-4 mr-1" /> New Post
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-1" /> Sign out
            </Button>
          </div>
        </div>

        {showForm && (
          <div className="mb-10 rounded-lg border border-border bg-card p-6">
            <h2 className="font-serif text-xl font-semibold mb-6">{editing ? 'Edit Post' : 'Create New Post'}</h2>
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="Post title" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={slug} onChange={e => setSlug(e.target.value)} placeholder="post-slug" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={12} placeholder="Write your post..." className="font-sans" />
              </div>
              <div className="grid gap-2">
                <Label>Image</Label>
                <div className="flex items-center gap-4">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
                    <Upload className="h-4 w-4" />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                  {imageUrl && <img src={imageUrl} alt="Preview" className="h-16 w-16 rounded object-cover" />}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="published" checked={published} onCheckedChange={setPublished} />
                <Label htmlFor="published">Published</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update Post' : 'Create Post'}
                </Button>
                <Button variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-16 animate-pulse rounded bg-muted" />)}
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground hidden md:table-cell">Slug</th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{post.title}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{post.slug}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        post.published ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(post)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">No posts yet. Create your first one!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
