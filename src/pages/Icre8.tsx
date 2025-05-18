import { useState, useEffect } from "react";
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

const Icre8 = () => {
  const [index, setIndex] = useState(-1); // -1 means closed
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback images if API fails
  const fallbackImages = [
    "1copy.jpg",
    "01copy.jpg",
    "2copy.jpg",
    "3acopy.jpg",
    "3bcopy.jpg",
    "3copy.jpg",
    "3ocopy.jpg",
    "4copy.jpg",
    "a.png",
    "b.png",
    "c.png",
    "d.png",
    "e.png",
    "f.png",
    "g.png",
    "h.png",
    "i.png",
    "j.png",
    "k.png",
    "l.png",
    "m.png",
    "n.png",
    "o.png",
    "p.png",
    "q.png",
    "r.png",
    "s.png",
    "t.png",
    "u.png",
    "v.png",
    "w.png",
    "x.png",
  ];

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
          "https://nakestudios-be.vercel.app/api/icre8"
        );

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        setImages(data.images);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching icre8 gallery images:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );

        const fallbackData = fallbackImages.map((img) => ({
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
  const slides = images.map((image) => ({
    src: image.url,
  }));

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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, i) => (
          <div key={image._id} className="aspect-[3/4] overflow-hidden rounded">
            <img
              src={image.url}
              alt={`Gallery image ${i + 1}`}
              onClick={() => setIndex(i)}
              loading="lazy"
              data-aos="fade-up"
              className="cursor-pointer w-full h-full aspect-[3/4] object-cover rounded hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
      />
    </div>
  );
};

export default Icre8;
