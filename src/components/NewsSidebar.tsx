import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, Tag } from "lucide-react";
import axios from "axios";
import { formatDate } from "../utils/dateFormatter"; // Import the shared formatter

interface News {
  _id: string;
  title: string;
  slug: string;
  image: string;
  author?: string;
  publishedAt: string;
  date?: string;
  categories?: string[];
}

interface Archive {
  year: number;
  month: number;
  displayDate: string;
  count: number;
}

const NewsSidebar: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [allNews, setAllNews] = useState<News[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [archives, setArchives] = useState<Archive[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const [archivesRes, categoriesRes, newsRes] = await Promise.all([
          axios.get("https://nakestudios-be.vercel.app/api/news/archives"),
          axios.get("https://nakestudios-be.vercel.app/api/news/categories"),
          axios.get("https://nakestudios-be.vercel.app/api/news?limit=10"),
        ]);
        setArchives(archivesRes.data);
        setCategories(categoriesRes.data);

        // Process news data to ensure consistent date formatting
        const processedNews = Array.isArray(newsRes.data)
          ? newsRes.data
          : newsRes.data?.data || [];

        const formattedNews = processedNews.map((item: any) => {
          // Ensure image is properly handled
          let imageUrl = "/placeholder-image.jpg";
          if (item.image && typeof item.image === "object" && item.image.url) {
            imageUrl = item.image.url;
          } else if (typeof item.image === "string") {
            imageUrl = item.image;
          }

          return {
            ...item,
            image: imageUrl,
            // Use the date field from the API if available (comes from backend's toClientJSON),
            // or format the publishedAt field
            date:
              item.date ||
              (item.publishedAt
                ? formatDate(item.publishedAt)
                : "Date not available"),
          };
        });

        setAllNews(formattedNews);
      } catch (error) {
        console.error("Error fetching sidebar data:", error);
      }
    };
    fetchSidebarData();
  }, []);

  // Generate suggestions locally
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setIsDropdownVisible(false);
      return;
    }

    const searchRegex = new RegExp(searchTerm.trim(), "i");
    const titleSuggestions = allNews
      .filter((news) => searchRegex.test(news.title))
      .map((news) => news.title)
      .slice(0, 3);
    const categorySuggestions = categories
      .filter((cat) => searchRegex.test(cat))
      .slice(0, 2);

    const combinedSuggestions = [...titleSuggestions, ...categorySuggestions];
    const uniqueSuggestions = [...new Set(combinedSuggestions)].slice(0, 5);
    setSuggestions(uniqueSuggestions);
    setIsDropdownVisible(true);
  }, [searchTerm, allNews, categories]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log("Navigating to search with term:", searchTerm.trim());
      navigate(`/news/search/${encodeURIComponent(searchTerm.trim())}`);
      setIsDropdownVisible(false);
      setSearchTerm("");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    navigate(`/news/search/${encodeURIComponent(suggestion)}`);
    setIsDropdownVisible(false);
  };

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search news..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              onFocus={() => searchTerm.trim() && setIsDropdownVisible(true)}
              onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)}
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </form>
        {isDropdownVisible && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-yellow-100 cursor-pointer"
                onMouseDown={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Archives */}
      <div>
        <h3 className="text-lg font-bold mb-4">Archives</h3>
        <ul className="space-y-2">
          {archives.map((archive, index) => (
            <li
              key={index}
              className="flex justify-between items-center text-gray-600 hover:text-yellow-500 cursor-pointer"
              onClick={() =>
                navigate(`/news/archives/${archive.year}/${archive.month}`)
              }
            >
              <span className="flex items-center">
                <Calendar size={16} className="mr-2" />
                {archive.displayDate}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                {archive.count}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-bold mb-4">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <span
              key={index}
              className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600 hover:bg-yellow-500 hover:text-white cursor-pointer"
              onClick={() => handleSuggestionClick(category)}
            >
              <Tag size={14} className="mr-1" />
              {category}
            </span>
          ))}
        </div>
      </div>

      {/* Recent News */}
      <div>
        <h3 className="text-lg font-bold mb-4">Recent News</h3>
        <ul className="space-y-4">
          {allNews.slice(0, 3).map((news, index) => (
            <li
              key={index}
              className="flex items-start space-x-3 cursor-pointer"
              onClick={() => navigate(`/news/${news.slug}`)}
            >
              <img
                src={news.image || "/placeholder-image.jpg"}
                alt={news.title}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) =>
                  (e.currentTarget.src = "/placeholder-image.jpg")
                }
              />
              <div>
                <h4 className="text-sm font-medium text-gray-800 hover:text-yellow-500">
                  {news.title}
                </h4>
                <p className="text-xs text-gray-500">
                  {/* Display the date field that is properly formatted now */}
                  {news.date}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NewsSidebar;
