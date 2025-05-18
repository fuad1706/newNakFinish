import React, { useState, useEffect } from "react";
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

  return (
    <div className="flex h-screen  text-white">
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
          {/* Sidebar Thumbnails */}
          <div className="w-1/4 p-4 space-y-4 overflow-y-auto bg-gray-900 border-r border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Video List</h2>
            {videos.map((video) => (
              <div
                key={video._id}
                className={`cursor-pointer hover:opacity-80 transition p-2 rounded ${
                  currentVideo?._id === video._id ? "bg-gray-800" : ""
                }`}
                onClick={() => setCurrentVideo(video)}
              >
                <img
                  src={video.thumbnail.url}
                  alt={video.title}
                  className="rounded mb-1 w-full h-auto"
                />
                <p className="text-sm text-gray-300">{video.title}</p>
              </div>
            ))}
          </div>

          {/* Main Video Player */}
          <div className="flex-1 flex flex-col items-center justify-center  p-6">
            {currentVideo && (
              <>
                <video
                  key={currentVideo.url}
                  src={currentVideo.url}
                  controls
                  autoPlay
                  className="w-full max-w-4xl rounded shadow-lg"
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
