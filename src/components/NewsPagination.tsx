import React from "react";

interface NewsPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
}

const NewsPagination: React.FC<NewsPaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center mt-12">
      <div className="inline-flex rounded-md">
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-yellow-50"
          } border border-gray-200`}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={`page-btn-${i}`}
              onClick={() => onPageChange(pageNum)}
              className={`px-4 py-2 text-sm font-medium border-t border-b border-r ${
                currentPage === pageNum
                  ? "bg-yellow-500 text-white"
                  : "bg-white text-gray-700 hover:bg-yellow-50"
              } ${i === totalPages - 1 ? "rounded-r-lg" : ""}`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          onClick={() =>
            currentPage < totalPages && onPageChange(currentPage + 1)
          }
          disabled={currentPage === totalPages}
          className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-yellow-50"
          } border border-l-0 border-gray-200`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NewsPagination;
