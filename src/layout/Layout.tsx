import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Router from "../routes/Router";
import Spinner from "../components/Spinner"; // adjust the path if needed

const Layout = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Trigger loading spinner on route change
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // simulate loading delay

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {loading && <Spinner />}
      <Header />
      <main className={loading ? "opacity-50 pointer-events-none" : ""}>
        <Router />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
