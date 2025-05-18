import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NewsCard from "../components/NewsCard";
import NewsSidebar from "../components/NewsSidebar";

interface News {
  id: string;
  slug: string;
  image: string;
  title: string;
  publishedAt: string;
  author: string;
  categories?: string[];
  excerpt: string;
}

const NewsCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [results, setResults] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/news?category=${encodeURIComponent(
            category || ""
          )}`
        );
        const data = Array.isArray(response.data) ? response.data : [];
        const transformedData: News[] = data.map((item: any) => ({
          id: item._id || "",
          slug: item.slug || "",
          image: item.image?.url || item.image || "/placeholder-image.jpg",
          title: item.title || "Untitled",
          publishedAt:
            item.publishedAt || item.createdAt || new Date().toISOString(),
          author: item.author || "Unknown",
          categories: Array.isArray(item.categories) ? item.categories : [],
          excerpt: item.excerpt || "No excerpt available",
        }));
        setResults(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (category) fetchCategoryNews();
  }, [category]);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-6">Category: {category}</h1>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && results.length === 0 && (
            <p>No news found for category "{category}".</p>
          )}
          {!loading && !error && results.length > 0 && (
            <div className="space-y-8">
              {results.map((news, index) => (
                <NewsCard
                  key={news.id}
                  news={news}
                  index={index}
                  isVisible={true}
                />
              ))}
            </div>
          )}
        </div>
        <div>
          <NewsSidebar />
        </div>
      </div>
    </div>
  );
};

export default NewsCategory;
