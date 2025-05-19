import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// Define the Video interface
interface Video {
  _id: string;
  title: string;
  thumbnail: {
    url: string;
  };
  url: string;
  isActive: boolean;
  order: number;
}

const Motion: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const videoPlayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://nakestudios-be.vercel.app/api/motion"
        );
        const fetchedVideos = response.data.videos;

        setVideos(fetchedVideos);

        // Set first video as current if videos exist
        if (fetchedVideos.length > 0) {
          setCurrentVideo(fetchedVideos[0]);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleVideoClick = (video: Video) => {
    setCurrentVideo(video);
    if (videoPlayerRef.current && window.innerWidth < 768) {
      // Smooth scroll to the video player with offset to account for headers
      const offset = 60; // Adjust based on any fixed headers
      const playerPosition =
        videoPlayerRef.current.getBoundingClientRect().top +
        window.scrollY -
        offset;
      window.scrollTo({
        top: playerPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex h-screen text-white md:flex-row flex-col">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">Loading videos...</div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl text-red-500">{error}</div>
        </div>
      ) : videos.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">No videos available</div>
        </div>
      ) : (
        <>
          {/* Sidebar Thumbnails (Desktop) / Video List (Mobile) */}
          <div className="md:w-1/4 md:p-4 md:space-y-4 md:overflow-y-auto md:bg-gray-900 md:border-r md:border-gray-700 p-4 space-y-4 overflow-y-auto bg-gray-100 text-black order-2 md:order-1">
            <h2 className="text-xl font-semibold mb-4 md:block hidden">
              Video List
            </h2>
            {videos.map((video) => (
              <div
                key={video._id}
                className={`cursor-pointer hover:opacity-80 transition p-2 rounded relative ${
                  currentVideo?._id === video._id
                    ? "bg-gray-800 md:bg-gray-800 bg-gray-300"
                    : ""
                }`}
                onClick={() => handleVideoClick(video)}
              >
                <div className="relative">
                  <img
                    src={video.thumbnail.url}
                    alt={video.title}
                    className="rounded w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-3xl bg-black bg-opacity-50 rounded-full p-2">
                      ▶
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-300 md:text-gray-300 text-yellow-700 truncate mt-2">
                  {video.title}
                </p>
              </div>
            ))}
          </div>

          {/* Main Video Player */}
          <div
            ref={videoPlayerRef}
            className="flex-1 flex flex-col items-center justify-center p-6 md:p-6 bg-gray-900 order-1 md:order-2"
          >
            {currentVideo && (
              <>
                <video
                  key={currentVideo.url}
                  src={currentVideo.url}
                  controls
                  autoPlay
                  muted // Added to allow autoplay on mobile
                  className="w-full md:max-w-4xl rounded shadow-lg"
                />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Motion;
