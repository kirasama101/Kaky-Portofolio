import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { getFooterContent, FooterContent } from "@/lib/mockData";

const FooterCTA = () => {
  const { language } = useLanguage();
  const [content, setContent] = useState<FooterContent | null>(null);

  useEffect(() => {
    getFooterContent().then(setContent);
  }, []);

  if (!content) return null;

  const isAr = language === "ar";

  return (
    <>
      <section
        id="contact"
        className="footer-cta-gradient border border-border mx-[5%] my-12 p-16 rounded-[30px] text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          {isAr ? content.title : content.titleEn}
        </h2>
        <p className="text-muted-foreground mb-8">
          {isAr ? content.description : content.descriptionEn}
        </p>
        <button className="btn btn-primary">
          {isAr ? content.cta : content.ctaEn}
        </button>
      </section>

      <footer className="text-center py-5 text-muted-foreground text-sm">
        © 2025 {isAr ? "جميع الحقوق محفوظة" : "All Rights Reserved"}
      </footer>
    </>
  );
};

export default FooterCTA;
