import React from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import ViewButton from "../components/ViewButton";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToICreate = () => {
    navigate("/icre8");
  };

  return (
    <section>
      <Hero />
      <div className="py-4 md:py-8 text-center">
        <ViewButton onClick={handleGoToICreate} />
      </div>
    </section>
  );
};

export default Home;
