import { useState, useEffect } from "react";
import axios from "axios";
import type { News } from "../types/News";
import { formatDate } from "../utils/dateFormatter";

export const useNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://nakestudios-be.vercel.app/api/news"
        );
        let newsData: News[] = [];

        // Handle different response formats
        if (Array.isArray(response.data)) {
          newsData = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          newsData = response.data.data;
        } else if (response.data?.news && Array.isArray(response.data.news)) {
          newsData = response.data.news;
        } else if (response.data && typeof response.data === "object") {
          newsData = [response.data];
        } else {
          throw new Error("Invalid API response format");
        }

        // Process dates and ensure all fields
        newsData = newsData.map((item) => ({
          ...item,
          _id: item._id || `temp-${Math.random()}`,
          slug: item.slug || `news-${item._id || Math.random()}`,
          title: item.title || "Untitled",
          excerpt: item.excerpt || "No excerpt available",
          image: item.image || { url: "/placeholder-image.jpg", public_id: "" },
          author: item.author || "Unknown",
          publishedAt:
            item.publishedAt || item.createdAt || new Date().toISOString(),
          date: item.date || formatDate(item.publishedAt),
          categories: Array.isArray(item.categories) ? item.categories : [],
          published: item.published ?? true,
          content: item.content || "",
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString(),
        }));

        // Filter invalid entries
        newsData = newsData.filter((item) => item && item._id);
        setNews(newsData);
        setLoading(false);
      } catch (err: any) {
        setError(
          news.length === 0
            ? "Failed to load news articles. The API may have returned no data."
            : "Failed to load news articles. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { news, loading, error };
};
