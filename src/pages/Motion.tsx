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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col lg:flex-row">
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
          {/* Sidebar Thumbnails (Hidden on Mobile) */}
          <div className="hidden lg:block lg:w-80 p-6 space-y-4 bg-gray-800 lg:h-screen lg:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-6 tracking-tight">
              Video Gallery
            </h2>
            {videos.map((video) => (
              <div
                key={video._id}
                className={`group relative cursor-pointer rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 ${
                  currentVideo?._id === video._id
                    ? "ring-2 ring-yellow-500"
                    : ""
                }`}
                onClick={() => setCurrentVideo(video)}
              >
                <img
                  src={video.thumbnail.url}
                  alt={video.title}
                  className="w-full h-32 object-cover rounded-lg group-hover:opacity-90 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <p className="mt-2 text-sm font-medium text-gray-200 group-hover:text-yellow-400 transition-colors duration-300">
                  {video.title}
                </p>
              </div>
            ))}
          </div>

          {/* Main Video Player */}
          <div className="flex-1 flex flex-col items-center justify-center p-2 lg:p-8 my-[-100px] bg-gray-900">
            {currentVideo && (
              <div className="w-full max-w-5xl">
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
                  <video
                    key={currentVideo.url}
                    src={currentVideo.url}
                    controls
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded-full flex items-center space-x-2">
                    <span className="text-sm font-semibold">
                      {currentVideo.title}
                    </span>
                    {/* Show progress indicator in desktop view only */}
                    <span className="hidden lg:inline text-xs text-gray-300">
                      {videos.findIndex((v) => v._id === currentVideo._id) + 1}{" "}
                      of {videos.length}
                    </span>
                  </div>
                </div>
                {/* Navigation Buttons and Progress Indicator (Visible on Mobile Only) */}
                <div className="flex items-center justify-between mt-4 lg:hidden">
                  <button
                    onClick={() =>
                      setCurrentVideo(
                        videos[
                          (videos.findIndex((v) => v._id === currentVideo._id) -
                            1 +
                            videos.length) %
                            videos.length
                        ]
                      )
                    }
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors duration-300 disabled:opacity-50"
                    disabled={videos.length <= 1}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-300">
                    {videos.findIndex((v) => v._id === currentVideo._id) + 1} of{" "}
                    {videos.length}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentVideo(
                        videos[
                          (videos.findIndex((v) => v._id === currentVideo._id) +
                            1) %
                            videos.length
                        ]
                      )
                    }
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors duration-300 disabled:opacity-50"
                    disabled={videos.length <= 1}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Motion;
