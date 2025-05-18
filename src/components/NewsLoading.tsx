import React from "react";

const NewsLoading: React.FC = () => (
  <div className="container mx-auto py-20 text-center">
    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
    <p className="mt-4">Loading news articles...</p>
  </div>
);

export default NewsLoading;
