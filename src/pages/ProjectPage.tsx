import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getProject, Project } from "@/lib/mockData";
import { useLanguage } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";

const ProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const [project, setProject] = useState<Project | null>(null);

  const isAr = language === "ar";

  useEffect(() => {
    if (id) {
      getProject(id).then((p) => setProject(p || null));
    }
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-[5%] py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          {isAr ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          {t.project.back}
        </Link>

        <div className="mb-8">
          <span className="tag mb-4 inline-block">
            {isAr ? project.tag : project.tagEn}
          </span>
          <h1 className="text-3xl md:text-5xl font-black mb-4">
            {isAr ? project.title : project.titleEn}
          </h1>
          {project.description && (
            <p className="text-muted-foreground text-lg max-w-2xl">
              {isAr ? project.description : project.descriptionEn}
            </p>
          )}
        </div>

        <h2 className="text-xl font-bold mb-6">{t.project.gallery}</h2>

        <div className="flex gap-5 overflow-x-auto pb-4">
          {project.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${project.title} - ${index + 1}`}
              className="h-[60vh] rounded-xl shadow-lg shadow-white/10 flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
