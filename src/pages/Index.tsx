import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BentoGrid from "@/components/BentoGrid";
import FooterCTA from "@/components/FooterCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <BentoGrid />
      <FooterCTA />
    </div>
  );
};

export default Index;
