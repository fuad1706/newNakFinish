import React, { useState } from "react";
import { ChevronRight, Calendar, User, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/dateFormatter";

// Define the shape of the news object
interface News {
  _id?: string;
  slug: string;
  image: string | { url: string; public_id: string };
  title: string;
  publishedAt: string;
  author: string;
  categories?: string[];
  excerpt: string;
  date?: string;
}

// Props for the NewsCard component
interface NewsCardProps {
  news: News;
  index: number;
  isVisible: boolean;
}

// Utility function to truncate text with ellipsis
const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text || "";

  // Find the last space within maxLength to avoid cutting mid-word
  let truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > 0 && lastSpace < maxLength - 3) {
    truncated = truncated.slice(0, lastSpace);
  } else {
    truncated = truncated.slice(0, maxLength - 3);
  }

  return `${truncated.trim()}...`;
};

// Single news card component with consistent styling and behavior
const NewsCard: React.FC<NewsCardProps> = ({ news, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get image URL safely
  const getImageUrl = (): string => {
    if (!news.image) return "/placeholder-image.jpg";

    if (typeof news.image === "object" && news.image.url) {
      return news.image.url;
    }

    if (typeof news.image === "string") {
      return news.image;
    }

    return "/placeholder-image.jpg";
  };

  // Get formatted date
  const getFormattedDate = (): string => {
    if (news.date && typeof news.date === "string") {
      return news.date;
    }
    return formatDate(news.publishedAt);
  };

  // Safeguard against undefined news object
  if (!news) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden p-5">
        <p className="text-gray-500">News item not available</p>
      </div>
    );
  }

  // Truncate title and excerpt
  const truncatedTitle = truncateText(news.title, 100);
  const truncatedExcerpt = truncateText(news.excerpt, 186);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-700 transform min-h-[580px] flex flex-col hover:shadow-lg
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
      style={{ transitionDelay: `${index * 150}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/news/${news.slug}`} className="block flex-shrink-0">
        <div className="relative overflow-hidden group cursor-pointer">
          <img
            src={getImageUrl()}
            alt={news.title || "News image"}
            className={`w-full h-64 object-cover transition-transform duration-700 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
              (e.target as HTMLImageElement).onerror = null;
            }}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/40 to-transparent transition-opacity duration-500 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          ></div>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex flex-wrap items-center mb-3 text-sm text-gray-500 gap-3">
          <span
            className={`bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-medium flex items-center transition-transform duration-300 ${
              isHovered ? "scale-105" : ""
            }`}
          >
            <Calendar size={14} className="mr-1" />
            {getFormattedDate()}
          </span>
          <span className="flex items-center">
            <User size={14} className="mr-1" />
            By {news.author || "Unknown"}
          </span>
        </div>

        {Array.isArray(news.categories) && news.categories.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Tag size={14} className="text-gray-500" />
            {news.categories.map((category, _idx) => (
              <Link
                key={category}
                to={`/news/category/${category
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="text-xs bg-gray-100 hover:bg-yellow-100 text-gray-700 hover:text-yellow-700 px-2 py-1 rounded-md transition-all duration-300 hover:translate-y-[-2px] hover:shadow-sm"
              >
                {category}
              </Link>
            ))}
          </div>
        )}

        <Link to={`/news/${news.slug}`} className="block">
          <h3
            className={`text-lg font-bold mb-2 transition-colors duration-300 cursor-pointer ${
              isHovered ? "text-yellow-500" : "text-black"
            }`}
          >
            {truncatedTitle || "Untitled News"}
          </h3>
        </Link>

        <p className="text-gray-600 mb-4 text-sm flex-grow">
          {truncatedExcerpt || "No excerpt available"}
        </p>

        <Link
          to={`/news/${news.slug}`}
          className={`flex items-center font-medium text-sm transition-all duration-300 group mt-auto ${
            isHovered ? "text-black translate-x-1" : "text-yellow-500"
          }`}
        >
          READ MORE
          <ChevronRight
            size={16}
            className={`ml-1 transition-transform duration-300 ${
              isHovered ? "translate-x-1" : ""
            }`}
          />
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;
