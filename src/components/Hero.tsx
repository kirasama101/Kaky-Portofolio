import { useLanguage } from "@/i18n/LanguageContext";
import { useEffect, useState } from "react";
import { getHeroContent, HeroContent } from "@/lib/database";
import DatabaseError from "./DatabaseError";

const Hero = () => {
  const { language } = useLanguage();
  const [content, setContent] = useState<HeroContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadContent = () => {
    setLoading(true);
    setError(null);
    getHeroContent()
      .then(setContent)
      .catch((err) => {
        console.error("Error loading hero content:", err);
        setError(err.message || "Failed to load content");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadContent();
  }, []);

  if (error) {
    return <DatabaseError message={error} onRetry={loadContent} />;
  }

  if (loading || !content) {
    return (
      <div className="text-center py-20 px-5">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const isAr = language === "ar";

  return (
    <section className="text-center py-20 px-5 max-w-[800px] mx-auto">
      <div className="badge">
        {isAr ? content.badge : content.badgeEn}
      </div>
      <h1 className="text-4xl md:text-6xl leading-tight mb-5 font-black">
        {isAr ? content.title : content.titleEn}
        <br />
        {isAr ? content.titleBreak : content.titleBreakEn}
      </h1>
      <p className="text-muted-foreground mb-8 text-lg">
        {isAr ? content.description : content.descriptionEn}
      </p>
      <div className="flex gap-4 justify-center flex-wrap">
        <button className="btn btn-primary">
          {isAr ? content.ctaPrimary : content.ctaPrimaryEn}
        </button>
        <button className="btn btn-secondary">
          {isAr ? content.ctaSecondary : content.ctaSecondaryEn}
        </button>
      </div>
    </section>
  );
};

export default Hero;
