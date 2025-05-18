import { Routes, Route } from "react-router-dom";
import About from "../pages/About";
import Home from "../pages/Home";
import Contact from "../pages/Contact";
import News from "../pages/News";
import NewsDetail from "../pages/NewsDetail";
import NewsArchives from "../pages/NewsArchives";
import Icre8 from "../pages/Icre8";
import Motion from "../pages/Motion";
import NewsSearchResults from "../components/NewsSearchResults";
import NewsCategory from "../pages/NewsCategory"; // Assuming this is the page (create if not exists)
import NotFound from "../components/NotFound";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/icre8" element={<Icre8 />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/motion" element={<Motion />} />
      {/* News Routes */}
      <Route path="/news">
        {/* Main news listing page */}
        <Route index element={<News />} />
        {/* More specific routes */}
        <Route path="archives" element={<NewsArchives />} />
        <Route path="archives/:year/:month" element={<NewsArchives />} />
        <Route path="search/:query" element={<NewsSearchResults />} />
        <Route path="category/:category" element={<NewsCategory />} />
        <Route path=":slug" element={<NewsDetail />} />
        <Route path="*" element={<NotFound />} />{" "}
        {/* Optional: Handle invalid sub-paths */}
      </Route>

      {/* Catch-all route - could redirect to a 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
