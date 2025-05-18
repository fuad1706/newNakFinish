import React from "react";
import NewsCard from "./NewsCard";
import NewsPagination from "./NewsPagination";
import type { News } from "../types/News";

interface NewsListProps {
  currentItems: News[];
  visibleItems: string[];
  totalPages: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
}

const NewsList: React.FC<NewsListProps> = ({
  currentItems,
  visibleItems,
  totalPages,
  currentPage,
  onPageChange,
}) => {
  if (!currentItems.length) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <p className="text-gray-600">
          No news articles found. Please check the API or database.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {currentItems.map((newsItem, index) => {
          if (!newsItem || !newsItem._id) return null;

          const imageUrl =
            typeof newsItem.image === "object" && newsItem.image.url
              ? newsItem.image.url
              : typeof newsItem.image === "string"
              ? newsItem.image
              : "/placeholder-image.jpg";

          return (
            <div key={`news-item-${newsItem._id}`}>
              <NewsCard
                news={{
                  _id: newsItem._id,
                  title: newsItem.title || "Untitled",
                  excerpt: newsItem.excerpt || "No excerpt available",
                  image: imageUrl,
                  author: newsItem.author || "Unknown",
                  publishedAt: newsItem.publishedAt || "",
                  date: newsItem.date,
                  slug: newsItem.slug || "",
                  categories: Array.isArray(newsItem.categories)
                    ? newsItem.categories
                    : [],
                }}
                index={index}
                isVisible={visibleItems.includes(newsItem._id)}
              />
            </div>
          );
        })}
      </div>
      {totalPages > 1 && (
        <NewsPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default NewsList;
