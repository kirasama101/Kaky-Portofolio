import { useLanguage } from "@/i18n/LanguageContext";
import { useEffect, useState } from "react";
import { getHeroContent, HeroContent } from "@/lib/mockData";

const Hero = () => {
  const { language } = useLanguage();
  const [content, setContent] = useState<HeroContent | null>(null);

  useEffect(() => {
    getHeroContent().then(setContent);
  }, []);

  if (!content) return null;

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
