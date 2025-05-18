import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Calendar, ArrowLeft } from "lucide-react";
import axios from "axios";
import NewsCard from "../components/NewsCard";
import NewsSidebar from "../components/NewsSidebar";

// Define interfaces for data structures - matching MongoDB schema
interface News {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  image:
    | {
        url: string;
        public_id: string;
      }
    | string;
  author: string;
  published: boolean;
  publishedAt: string;
  slug: string;
  categories: string[];
  createdAt: string;
  updatedAt: string;
}

interface Archive {
  year: number;
  month: number;
  displayDate: string;
  count: number;
}

// Component
const NewsArchives: React.FC = () => {
  const { year, month } = useParams<{ year: string; month: string }>();
  const navigate = useNavigate();
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [archiveDate, setArchiveDate] = useState<string>("");
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  const [availableArchives, setAvailableArchives] = useState<Archive[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Format date for display
  const formatArchiveDate = (year: string, month: string): string => {
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Fetch archives
  useEffect(() => {
    const fetchArchives = async () => {
      try {
        // Using axios instead of fetch to be consistent
        const response = await axios.get(
          "https://nakestudios-be.vercel.app/api/news/archives"
        );
        const data: Archive[] = Array.isArray(response.data)
          ? response.data
          : [];

        // Sort archives by date (newest first)
        setAvailableArchives(
          data.sort(
            (a, b) =>
              new Date(b.year, b.month - 1).getTime() -
              new Date(a.year, a.month - 1).getTime()
          )
        );
      } catch (error) {
        console.error("Error fetching archives:", error);
        setError("Failed to load archives. Please try again later.");
      }
    };
    fetchArchives();
  }, []);

  // Fetch news by archive
  useEffect(() => {
    if (year && month) {
      const fetchNewsByArchive = async () => {
        try {
          setLoading(true);
          // Using axios and consistent base URL
          const response = await axios.get(
            `https://nakestudios-be.vercel.app/api/news/archives/${year}/${month}`
          );

          let newsData: News[] = [];
          if (Array.isArray(response.data)) {
            newsData = response.data;
          } else if (
            response.data &&
            typeof response.data === "object" &&
            response.data.data
          ) {
            // Handle if API returns { data: [...news] } format
            newsData = Array.isArray(response.data.data)
              ? response.data.data
              : [];
          }

          setFilteredNews(newsData);
          setArchiveDate(formatArchiveDate(year, month));

          // Staggered appearance, same as in News component
          setTimeout(() => {
            setVisibleItems(newsData.map((item) => item._id));
          }, 100);

          setLoading(false);
          window.scrollTo(0, 0);
        } catch (error) {
          console.error("Error fetching news by archive:", error);
          setError("Failed to load news articles for this period.");
          setLoading(false);
        }
      };
      fetchNewsByArchive();
    }
  }, [year, month]);

  // Helper function to get image URL (same as in NewsDetail)
  const getImageUrl = (news: News): string => {
    if (!news.image) return "/placeholder-image.jpg";

    if (typeof news.image === "object" && news.image.url) {
      return news.image.url;
    }

    if (typeof news.image === "string") {
      return news.image;
    }

    return "/placeholder-image.jpg";
  };

  // Helper function to format date (same as in NewsDetail)
  const formatDate = (news: News): string => {
    if (news.publishedAt) {
      return new Date(news.publishedAt).toLocaleDateString();
    }
    return new Date(news.createdAt).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
        <p className="mt-4">Loading articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg inline-block">
          <p>{error}</p>
          <button
            onClick={() => navigate("/news")}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Back to News
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 lg:px-20 md:px-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate("/news")}
            className="flex items-center mb-4 md:mb-0 text-gray-600 hover:text-yellow-500 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to All News
          </button>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center">
          <Calendar size={24} className="mr-2 text-yellow-500" />
          Archive: {archiveDate}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - filtered news grid */}
        <div className="lg:col-span-2">
          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {filteredNews.map((newsItem, index) => {
                // Map to the format expected by NewsCard
                return (
                  <div key={`news-${newsItem._id}`}>
                    <NewsCard
                      news={{
                        title: newsItem.title || "Untitled",
                        excerpt: newsItem.excerpt || "No excerpt available",
                        image: getImageUrl(newsItem),
                        author: newsItem.author || "Unknown",
                        publishedAt: formatDate(newsItem),
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
          ) : (
            <div className="py-16 text-center">
              <p className="text-xl text-gray-500">
                No news articles found for this period.
              </p>
              <Link
                to="/news"
                className="mt-4 inline-block px-6 py-2 bg-yellow-500 text-black rounded-full hover:bg-black hover:text-white transition-colors"
              >
                View All News
              </Link>
            </div>
          )}

          {/* Archive links grid for all available archives */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Calendar size={20} className="mr-2 text-yellow-500" />
              All Archives
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableArchives.map((archive) => (
                <Link
                  key={`${archive.year}-${archive.month}`}
                  to={`/news/archives/${archive.year}/${archive.month}`}
                  className={`flex items-center justify-between p-3 rounded hover:bg-yellow-50 transition-colors
                    ${
                      year &&
                      month &&
                      parseInt(year) === archive.year &&
                      parseInt(month) === archive.month
                        ? "bg-yellow-100 font-medium"
                        : "bg-white"
                    }`}
                >
                  <span>{archive.displayDate}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {archive.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - reusing the NewsSidebar component */}
        <div className="lg:col-span-1">
          <NewsSidebar />
        </div>
      </div>
    </div>
  );
};

export default NewsArchives;
