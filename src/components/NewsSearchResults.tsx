import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NewsSidebar from "../components/NewsSidebar";
import NewsCard from "../components/NewsCard";

// Define interface
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

const NewsSearchResults: React.FC = () => {
  const { query } = useParams<{ query: string }>();
  const [results, setResults] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Format date to "Month DD, YYYY"
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Date unavailable";
    }
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        console.log("Search query from params:", query);
        if (!query || query.trim() === "") {
          throw new Error("Search query is empty or invalid");
        }

        const response = await fetch(
          `http://localhost:3000/api/news/search?q=${encodeURIComponent(query)}`
        );
        console.log("Search API Response Status:", response.status);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch search results: ${response.status} ${errorText}`
          );
        }
        const data = await response.json();
        console.log("Search API Response Data:", data);

        const transformedData: News[] = Array.isArray(data)
          ? data.map((item: any) => ({
              id: item._id || item.id || "",
              slug: item.slug || "",
              image: item.image?.url || item.image || "/placeholder-image.jpg",
              title: item.title || "Untitled",
              publishedAt: item.publishedAt || item.createdAt || "", // Remove current date fallback
              author: item.author || "Unknown",
              categories: Array.isArray(item.categories) ? item.categories : [],
              excerpt: item.excerpt || "No excerpt available",
            }))
          : [];

        setResults(transformedData);
      } catch (err) {
        console.error("Error in fetchSearchResults:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-6">
            Search Results for "{query || "No Query"}"
          </h1>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && results.length === 0 && (
            <p>No results found for "{query}".</p>
          )}
          {!loading && !error && results.length > 0 && (
            <div className="space-y-8">
              {results.map((news, index) => (
                <NewsCard
                  key={news.id || index}
                  news={{
                    ...news,
                    publishedAt: formatDate(news.publishedAt),
                  }}
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

export default NewsSearchResults;
