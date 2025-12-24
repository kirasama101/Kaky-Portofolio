import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  return (
    <nav className="flex justify-between items-center px-[5%] py-5 bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border">
      <Link to="/" className="font-black text-xl flex items-center gap-2.5">
        {t.nav.logo}
      </Link>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleLanguage}
          className="px-3 py-1.5 rounded-full border border-border text-sm hover:bg-secondary transition-colors"
        >
          {language === "ar" ? "EN" : "عربي"}
        </button>
        <Link to="/admin" className="nav-btn">
          {t.nav.startProject}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
