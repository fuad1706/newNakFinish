import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper"; // Use Swiper type from swiper

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Define types for our data structures
interface HeroImage {
  url: string;
  public_id: string;
  order: number;
  isActive: boolean;
  _id: string;
}

interface ApiResponse {
  images: HeroImage[];
}

interface PhotoSlide {
  image: string;
}

const Hero: React.FC = () => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  // Define fallback images to use only if API fetch fails
  const fallbackImages: PhotoSlide[] = [
    { image: "/images/img1.jpg" },
    { image: "/images/img2.jpg" },
    { image: "/images/img3.jpg" },
    { image: "/images/img4.jpg" },
  ];

  const [photoSlides, setPhotoSlides] = useState<PhotoSlide[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch images from the API
    const fetchImages = async () => {
      try {
        setLoading(true);
        // Use the public hero images endpoint
        const response = await fetch(
          "https://nakestudios-be.vercel.app/api/hero"
        );

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        // Only update if we got valid data
        if (data.images && data.images.length > 0) {
          // Based on the heroController response structure
          // The API returns { images: [...] } where each image has a url property
          const formattedData: PhotoSlide[] = data.images.map(
            (item: HeroImage) => ({
              image: item.url,
            })
          );

          setPhotoSlides(formattedData);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching hero images:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        // Use fallback images if API fetch fails
        setPhotoSlides(fallbackImages);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (swiperInstance) {
      swiperInstance.autoplay.start();
    }
  }, [swiperInstance]);

  // If still loading, return null to let the main page spinner handle it
  if (loading) {
    return null;
  }

  return (
    <div className="w-full overflow-x-hidden">
      <style>
        {`
          @media (max-width: 768px) {
            .swiper-button-next,
            .swiper-button-prev {
              display: none !important;
            }
            .hero-container {
              height: 70vh !important;
            }
            .slide-bg {
              height: 100% !important;
              padding-top: 0 !important;
            }
          }
          .swiper-button-next,
          .swiper-button-prev {
            color: white !important;
          }
          .swiper-pagination {
            bottom: 20px !important;
          }
          .swiper-pagination-bullet {
            width: 14px !important;
            height: 14px !important;
            background: white !important;
            opacity: 1 !important;
          }
          .swiper-pagination-bullet-active {
            width: 18px !important;
            height: 18px !important;
            background: #D4AF37 !important;
          }
          .hero-container {
            height: 100vh;
          }
          .slide-bg {
            padding-top: 56.25%;
          }
        `}
      </style>
      <div className="hero-container">
        {error && (
          <div className="absolute top-0 left-0 w-full z-50 bg-red-500 text-white text-center py-2">
            Error loading images: {error}
          </div>
        )}
        {photoSlides.length > 0 && (
          <Swiper
            onSwiper={(swiper: SwiperType) => setSwiperInstance(swiper)}
            modules={[Autoplay, Pagination, Navigation]}
            speed={1000}
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            loop={photoSlides.length > 1}
            className="w-full h-full swiper-pagination-white"
          >
            {photoSlides.map((slide, index) => (
              <SwiperSlide key={index} className="h-full">
                <div
                  className="relative w-screen slide-bg"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                  role="img"
                  aria-label={`Photography work ${index + 1}`}
                ></div>
              </SwiperSlide>
            ))}

            {/* Custom Navigation Buttons */}
            <div className="swiper-button-next"></div>
            <div className="swiper-button-prev"></div>
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default Hero;
