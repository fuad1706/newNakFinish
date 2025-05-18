import React, { useState, useEffect, useRef } from "react";
import { X, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [_headerHeight, setHeaderHeight] = useState<number>(0);
  const headerRef = useRef<HTMLElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    // Calculate header height and apply to document
    const calculateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        setHeaderHeight(height);
        document.body.style.paddingTop = `${height}px`;
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Calculate on mount and resize
    calculateHeaderHeight();
    window.addEventListener("resize", calculateHeaderHeight);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", calculateHeaderHeight);
      document.body.style.paddingTop = "0px";
    };
  }, []);

  // Recalculate header height when top bar visibility changes
  useEffect(() => {
    if (headerRef.current) {
      const height = headerRef.current.offsetHeight;
      setHeaderHeight(height);
      document.body.style.paddingTop = `${height}px`;
    }
  }, [scrollPosition > 100]);

  return (
    <header ref={headerRef} className="w-full fixed top-0 left-0 z-40">
      {/* Top Info Bar */}

      {/* Main Navigation */}
      <div
        className={`w-full bg-white lg:px-20 md:px-10 px-4 shadow-md transition-all duration-300 ${
          scrollPosition > 50 ? "py-2" : "py-2"
        }`}
      >
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="py-2">
            <a href="#">
              <img
                src="/images/logo.png"
                alt="logo"
                className="w-[200px] h-[60px] object-contain"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            {[
              { name: "HOME", path: "/" },
              { name: "ABOUT", path: "/about" },
              { name: "iCre8", path: "/icre8" },
              { name: "PHOTOGRAPHY", path: "/photography" },
              { name: "MOTION", path: "/motion" },
              { name: "NEWS", path: "/news" },
              // { name: "BLOG", path: "/blog" },
              { name: "CONTACT", path: "/contact" },
            ].map(({ name, path }, _index) => (
              <Link
                key={name}
                to={path}
                className={`text-black hover:text-yellow-500 px-3 py-2 text-sm tracking-wide ${
                  location.pathname === path ? "text-yellow-500" : ""
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-black p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile menu - rises from bottom */}
      <div
        className={`fixed inset-0 bg-white z-50 flex flex-col transition-transform duration-500 ease-in-out ${
          isMenuOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center p-4">
          <div>
            <img
              src="/images/logo.png"
              alt="logo"
              className="w-[200px] h-[60px] object-contain"
            />
          </div>
          <button
            className="text-white p-2 bg-gray-800"
            onClick={() => setIsMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col mt-4">
          {[
            { name: "HOME", path: "/" },
            { name: "ABOUT", path: "/about" },
            { name: "iCre8", path: "/icre8" },
            { name: "PHOTOGRAPHY", path: "/photography" },
            { name: "MOTION", path: "/motion" },
            { name: "NEWS", path: "/news" },
            // { name: "BLOG", path: "/blog" },
            { name: "CONTACT", path: "/contact" },
          ].map(({ name, path }) => (
            <Link
              key={name}
              to={path}
              className={`py-4 px-6 border-b mx-6 border-gray-200 ${
                location.pathname === path
                  ? "text-yellow-500"
                  : "text-black hover:text-yellow-500"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
