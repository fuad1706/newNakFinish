export interface News {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  image: { url: string; public_id: string } | string;
  author: string;
  published: boolean;
  publishedAt: string;
  date?: string;
  slug: string;
  categories: string[];
  createdAt: string;
  updatedAt: string;
}
