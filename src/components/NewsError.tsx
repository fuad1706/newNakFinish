import React from "react";

interface NewsErrorProps {
  error: string;
}

const NewsError: React.FC<NewsErrorProps> = ({ error }) => (
  <div className="container mx-auto py-20 text-center">
    <div className="bg-red-100 text-red-700 p-4 rounded-lg inline-block">
      <p>{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default NewsError;
