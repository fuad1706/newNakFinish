import React, { useState, useEffect } from "react";

interface ViewButtonProps {
  onClick: () => void;
}

const ViewButton: React.FC<ViewButtonProps> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [bounce, setBounce] = useState<boolean>(false);

  // Set up the bounce animation interval
  useEffect(() => {
    const interval = setInterval(() => {
      setBounce(true);
      setTimeout(() => setBounce(false), 700);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <button
      className={`relative px-6 py-3 rounded-md cursor-pointer group transition-all duration-300 ${
        isHovered ? "bg-black bg-opacity-5" : "bg-transparent"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick} // Added onClick handler
    >
      {/* Gradient border */}
      <div className="absolute inset-0 rounded-md -z-10">
        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-yellow-500 via-amber-600 to-black" />
      </div>

      {/* Inner background */}
      <div className="absolute inset-0.5 rounded-md bg-white dark:bg-black -z-10" />

      <div className="flex items-center space-x-2">
        <span className="text-lg font-medium bg-gradient-to-r from-yellow-500 via-amber-600 to-black bg-clip-text text-transparent">
          View ICre8
        </span>

        {/* Arrow with bounce effect */}
        <svg
          className={`w-5 h-5 transform transition-transform ${
            bounce ? "translate-x-1" : ""
          } ${isHovered ? "translate-x-2" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          style={{ stroke: "url(#gradient)" }}
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
          </defs>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </div>
    </button>
  );
};

export default ViewButton;
