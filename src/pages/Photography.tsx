import React, { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import AOS from "aos";
import "aos/dist/aos.css";

const imgList: string[] = [
  "0.png",
  "1.png",
  "2.png",
  "3.png",
  "4.png",
  "5.png",
  "6.png",
  "7.png",
  "8.png",
  "9.png",
  "10.png",
  "11.png",
  "12.png",
  "13.png",
  "14.png",
  "15.png",
  "16.png",
  "17.png",
  "18.png",
  "19.png",
  "20.png",
  "21.png",
  "22.png",
  "23.png",
  "24.png",
  "25.png",
  "26.png",
  "27.png",
  "28.png",
  "29.png",
  "30.png",
  "31.png",
  "32.png",
  "33.png",
  "34.png",
  "35.png",
  "36.png",
  "37.png",
  "38.png",
  "39.png",
  "40.png",
  "41.png",
  "42.png",
  "43.png",
  "44.png",
  "45.png",
  "46.png",
  "47.png",
  "48.png",
  "49.png",
  "50.png",
  "51.png",
  "52.png",
  "53.png",
  "54.png",
  "55.png",
  "56.png",
  "57.png",
  "58.png",
  "59.png",
  "60.png",
  "61.png",
  "62.png",
  "63.png",
  "64.png",
  "65.png",
  "66.png",
  "67.png",
  "68.png",
  "69.png",
  "70.png",
  "71.png",
  "72.png",
  "73.png",
  "74.png",
];

interface Slide {
  src: string;
}

const Photography: React.FC = () => {
  const [index, setIndex] = useState<number>(-1); // -1 means closed

  useEffect(() => {
    AOS.init({
      duration: 800, // Animation duration in ms
      once: true, // Only animate once when scrolled into view
      easing: "ease-in-out",
    });
  }, []);

  const slides: Slide[] = imgList.map((img: string) => ({
    src: `/images/${img}`,
  }));

  const handleImageClick = (i: number): void => {
    setIndex(i);
  };

  const handleCloseLightbox = (): void => {
    setIndex(-1);
  };

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {slides.map((slide: Slide, i: number) => (
        <img
          key={i}
          src={slide.src}
          alt={`Image ${i}`}
          onClick={() => handleImageClick(i)}
          loading="lazy"
          data-aos="fade-up" // 👈 AOS scroll animation
          className="cursor-pointer w-full h-full aspect-[3/4] object-cover rounded hover:scale-105 transition-transform duration-300"
        />
      ))}

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
