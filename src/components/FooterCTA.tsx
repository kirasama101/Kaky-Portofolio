import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { getFooterContent, FooterContent } from "@/lib/database";
import DatabaseError from "./DatabaseError";

const FooterCTA = () => {
  const { language } = useLanguage();
  const [content, setContent] = useState<FooterContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadContent = () => {
    setLoading(true);
    setError(null);
    getFooterContent()
      .then(setContent)
      .catch((err) => {
        console.error("Error loading footer content:", err);
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
      <footer className="text-center py-5 text-muted-foreground text-sm">
        {language === "ar" ? "جاري التحميل..." : "Loading..."}
      </footer>
    );
  }

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
