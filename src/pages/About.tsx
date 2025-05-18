import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const About: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div
      id="about"
      className="flex flex-col gap-12 px-4 md:px-10 lg:px-48 py-12"
    >
      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-[65%]" data-aos="fade-up">
          <h3 className="mb-4 uppercase text-gray-500 font-bold">About Us</h3>
          <h2 className="mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-snug font-livvic">
            NAKESTUDiOS is a creative outfit that specializes in the intricate
            crafts of cinematography, focusing on both motion and still.
          </h2>
          <h3 className="mb-6 text-xl sm:text-2xl text-gray-600 leading-relaxed">
            Our mission is to capture the essence of moments and transform them
            into captivating narratives that resonate deeply and create
            unforgettable memories.
          </h3>
          <p className="text-gray-700 leading-relaxed">
            <strong>WHO WE ARE:</strong> We are a team of passionate visual
            artists, directors, and storytellers dedicated to pushing the
            boundaries of creativity. Our expertise spans various genres and
            styles, ensuring each project we undertake is a unique masterpiece.
            From high-impact motions to breathtaking visuals, we bring a wealth
            of experience and innovation to every frame.
          </p>
        </div>

        <div
          className="w-full md:w-[35%] flex flex-col gap-4 items-start mt-8 md:mt-0"
          data-aos="fade-left"
        >
          <img
            src="/images/Bolu_nake.jpg"
            alt="Bolu"
            className="w-full rounded shadow-lg object-cover"
          />
          <img
            src="/images/bolu_sign.png"
            alt="Sign"
            className="h-16 sm:h-20 object-contain"
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-1/2" data-aos="fade-up">
          <div className="mb-10">
            <h3 className="text-xl md:text-2xl font-semibold mb-4">
              Cinematography & Photography
            </h3>
            <p className="text-gray-700 leading-relaxed text-base max-w-[60ch]">
              We excel in both motion and still directing, using
              state-of-the-art equipment and cutting-edge techniques to deliver
              stunning visuals. Our work is defined by its emotional depth,
              technical excellence, and creative brilliance.
            </p>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-4">
              Visual Storytelling
            </h3>
            <p className="text-gray-700 leading-relaxed text-base max-w-[60ch]">
              Every project at NAKESTUDiOS begins with a story. We believe that
              the most powerful visuals are those that tell a story and evoke
              emotion. Our team works closely with clients to understand their
              vision and bring it to life through compelling narratives.
            </p>
          </div>
        </div>

        <div
          className="w-full lg:w-1/2"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="mb-10">
            <h3 className="text-xl md:text-2xl font-semibold mb-4">
              Creating Memories
            </h3>
            <p className="text-gray-700 leading-relaxed text-base max-w-[60ch]">
              Whether it’s a commercial project, a special event, or a personal
              milestone, we are committed to capturing and creating memories
              that last a lifetime. Our approach is personalized and meticulous,
              ensuring that each moment is preserved in its most beautiful and
              authentic form.
            </p>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-4">
              Our Commitment
            </h3>
            <p className="text-gray-700 leading-relaxed text-base max-w-[60ch]">
              For those who live and breathe visual arts, NAKESTUDiOS offers
              advanced resources, exclusive workshops, and masterclasses led by
              industry pioneers. We foster a community of elite professionals
              who share a passion for innovation and excellence, providing the
              tools and inspiration needed to elevate your craft.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
