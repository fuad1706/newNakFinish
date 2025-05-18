import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import NewsSidebar from "../components/NewsSidebar";
import axios from "axios";
import { formatDate } from "../utils/dateFormatter"; // Import the shared formatter

// Updated interface to match the MongoDB schema
interface News {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string; // Update to handle both string and object
  author: string;
  published: boolean;
  publishedAt: string;
  date?: string; // Add date field that may come from the backend's toClientJSON
  slug: string;
  categories: string[];
  createdAt: string;
  updatedAt: string;
}

// Component
const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<News | null>(null);
  const [relatedNews, setRelatedNews] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      if (!slug) {
        setError("News article not found - missing slug parameter");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching news details for slug:", slug);

        const response = await axios.get(
          `https://nakestudios-be.vercel.app/api/news/${slug}`
        );
        console.log("News API Response:", response);

        if (response.status === 200 && response.data) {
          // Process the news item
          const newsItem = response.data;

          // Handle image property
          let imageUrl = "/placeholder-image.jpg";
          if (
            newsItem.image &&
            typeof newsItem.image === "object" &&
            newsItem.image.url
          ) {
            imageUrl = newsItem.image.url;
          } else if (typeof newsItem.image === "string") {
            imageUrl = newsItem.image;
          }

          // Process news item
          const processedNews = {
            ...newsItem,
            image: imageUrl,
            // Use the date field from the API if available (from backend's toClientJSON),
            // otherwise format the publishedAt field
            date:
              newsItem.date ||
              (newsItem.publishedAt
                ? formatDate(newsItem.publishedAt)
                : "Date not available"),
          };

          setNews(processedNews);
          console.log("News details fetched successfully:", processedNews);

          try {
            console.log("Fetching related news...");
            const allNewsResponse = await axios.get(
              "https://nakestudios-be.vercel.app/api/news?limit=4"
            );
            console.log("Related news API response:", allNewsResponse.data);

            const allNews: any[] = Array.isArray(allNewsResponse.data)
              ? allNewsResponse.data
              : allNewsResponse.data.data || [];

            const related = allNews
              .filter((item) => item.slug !== slug)
              .map((item) => {
                // Handle image property for related news
                let itemImageUrl = "/placeholder-image.jpg";
                if (
                  item.image &&
                  typeof item.image === "object" &&
                  item.image.url
                ) {
                  itemImageUrl = item.image.url;
                } else if (typeof item.image === "string") {
                  itemImageUrl = item.image;
                }

                return {
                  ...item,
                  image: itemImageUrl,
                  // Use the date field from the API if available, otherwise format the publishedAt field
                  date:
                    item.date ||
                    (item.publishedAt
                      ? formatDate(item.publishedAt)
                      : "Date not available"),
                };
              })
              .sort(() => 0.5 - Math.random())
              .slice(0, 2);

            setRelatedNews(related);
          } catch (relatedError) {
            console.error("Error fetching related news:", relatedError);
          }

          setLoading(false);
          window.scrollTo(0, 0);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error: any) {
        console.error("Error in news detail flow:", error);
        if (error.response) {
          setError(
            `Failed to load news article: ${error.response.status} ${
              error.response.data.message || error.response.statusText
            }`
          );
        } else {
          setError("Failed to load news article. Please try again later.");
        }
        setLoading(false);
      }
    };

    fetchNews();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg inline-block">
          <p>{error || "News article not found"}</p>
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
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-8 text-gray-600 hover:text-yellow-500 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to News
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-medium flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {/* Display the date that is now properly formatted */}
                  {news.date}
                </span>
                <span className="ml-3 flex items-center">
                  <User size={14} className="mr-1" />
                  By {news.author || "Unknown"}
                </span>
              </div>
              <button className="flex items-center text-gray-500 hover:text-yellow-500 transition-colors">
                <Share2 size={18} />
                <span className="ml-2 text-sm hidden md:inline">Share</span>
              </button>
            </div>
          </div>
          <div className="mb-8">
            <img
              src={news.image || "/placeholder-image.jpg"}
              alt={news.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div className="prose max-w-none mb-16">
            <p className="text-lg mb-4">{news.excerpt}</p>
            {news.content
              .split("\n")
              .filter((para) => para.trim() !== "")
              .map((paragraph, index) => (
                <p key={`para-${index}`} className="mb-4">
                  {paragraph.trim()}
                </p>
              ))}
          </div>
          {relatedNews.length > 0 && (
            <div className="mb-8 lg:mb-0">
              <h2 className="text-2xl font-bold mb-6">Related News</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedNews.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/news/${item.slug}`)}
                  >
                    <div className="relative overflow-hidden group">
                      <img
                        src={item.image || "/placeholder-image.jpg"}
                        alt={item.title}
                        className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-2 hover:text-yellow-500 transition-colors">
                        {item.title}
                      </h3>
                      <div className="text-xs text-gray-500">
                        {/* Display the date that is now properly formatted */}
                        {item.date} • {item.author || "Unknown"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="lg:col-span-1">
          <NewsSidebar />
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
