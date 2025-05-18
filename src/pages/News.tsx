import React, { useState, useEffect } from "react";
import { useNews } from "../hooks/useNews";
import NewsPageHero from "../components/NewsPageHero";
import NewsList from "../components/NewsList";
import NewsSidebar from "../components/NewsSidebar";
import NewsError from "../components/NewsError";

const News: React.FC = () => {
  const { news, error } = useNews();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(news.length / itemsPerPage));

  // Reset pagination when news changes
  useEffect(() => {
    setCurrentPage(1);
  }, [news]);

  // Handle visibility of news cards
  const currentItems = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return news.slice(start, end);
  }, [news, currentPage]);

  useEffect(() => {
    const ids = currentItems
      .filter((item) => item && item._id)
      .map((item) => item._id);
    setVisibleItems(ids);
  }, [currentItems]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Only return error component, remove loading state
  if (error) return <NewsError error={error} />;

  return (
    <section>
      <NewsPageHero />
      <div className="container mx-auto lg:px-20 md:px-10 px-4 pb-16 pt-[80px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <NewsList
              currentItems={currentItems}
              visibleItems={visibleItems}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
          <div className="lg:col-span-1">
            <NewsSidebar />
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;
