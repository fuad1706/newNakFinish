import React, { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import AOS from "aos";
import "aos/dist/aos.css";

// Define types for our data structures
interface GalleryImage {
  url: string;
  public_id: string;
  _id: string;
  isActive?: boolean;
  order?: number;
}

interface ApiResponse {
  images: GalleryImage[];
}

interface Slide {
  src: string;
}

const imgList: string[] = [
  "a1.png",
  "a2.png",
  "a3.png",
  "a4.png",
  "a5.png",
  "a6.png",
  "a7.png",
  "a8.png",
  "a9.png",
  "a10.png",
  "a11.png",
  "a12.png",
  "a13.JPG",
  "a14.JPG",
  "a15.png",
  "a16.png",
  "a17.png",
  "a18.png",
  "a19.png",
  "a20.png",
  "a21.png",
  "a22.png",
  "a23.png",
  "a24.png",
  "a25.png",
  "a26.png",
  "a27.png",
  "a28.png",
  "a29.png",
  "a30.png",
  "a31.png",
  "a32.png",
  "a33.png",
  "a34.JPG",
  "a35.png",
  "a36.png",
  "a37.jpg",
  "a38.png",
  "a39.png",
  "a40.jpg",
  "a41.png",
  "a42.png",
  "a43.png",
  "a44.png",
  "a45.png",
  "a46.png",
  "a47.png",
  "a48.png",
  "a49.png",
  "a50.png",
  "a51.png",
  "a52.png",
  "a53.png",
  "a54.png",
  "a55.png",
  "a56.png",
  "a57.png",
  "a58.jpg",
  "a59.jpg",
  "a60.jpg",
  "a61.jpg",
  "a62.png",
  "a63.png",
  "a64.png",
  "a65.png",
  "a66.png",
  "a67.png",
  "a68.png",
  "a69.jpg",
];

const Photography: React.FC = () => {
  const [index, setIndex] = useState<number>(-1); // -1 means closed
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize AOS and fetch images
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });

    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://nakestudios-be.vercel.app/api/photography"
        );

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        setImages(data.images);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching photography gallery images:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );

        const fallbackData = imgList.map((img) => ({
          url: `/images/${img}`,
          public_id: img,
          _id: img,
        }));

        setImages(fallbackData);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Prepare slides for Lightbox
  const slides: Slide[] = images.map((image) => ({
    src: image.url,
  }));

  const handleImageClick = (i: number): void => {
    setIndex(i);
  };

  const handleCloseLightbox = (): void => {
    setIndex(-1);
  };

  if (loading && images.length === 0) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading gallery...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {error && (
        <div className="w-full bg-red-500 text-white text-center py-2 mb-4 rounded">
          Error loading images: {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, i) => (
          <img
            key={image._id}
            src={image.url}
            alt={`Image ${i}`}
            onClick={() => handleImageClick(i)}
            loading="lazy"
            data-aos="fade-up"
            className="cursor-pointer w-full h-full aspect-[3/4] object-cover rounded hover:scale-105 transition-transform duration-300"
          />
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        close={handleCloseLightbox}
        index={index}
        slides={slides}
      />
    </div>
  );
};

export default Photography;