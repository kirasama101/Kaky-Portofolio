import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getProject, Project } from "@/lib/database";
import { useLanguage } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import DatabaseError from "@/components/DatabaseError";
import ProjectGallery from "@/components/ProjectGallery";

const ProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isAr = language === "ar";

  useEffect(() => {
    if (id) {
      setLoading(true);
      getProject(id)
        .then((p) => setProject(p || null))
        .catch((err) => {
          console.error("Error loading project:", err);
          setError(err.message || "Failed to load project");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <DatabaseError message={error} />
      </div>
    );
  }

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-muted-foreground">
            {isAr ? "جاري التحميل..." : "Loading..."}
          </p>
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

        {(project.images.length > 0 || (project.videos && project.videos.length > 0)) && (
          <div className="mt-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">{t.project.gallery}</h2>
            <div style={{ contain: "layout style paint" }}>
              <ProjectGallery
                images={project.images}
                videos={project.videos}
                projectTitle={isAr ? project.title : project.titleEn}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPage;
