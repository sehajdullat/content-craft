export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
}
