import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { getProjects, Project } from "@/lib/mockData";
import ProjectCard from "./ProjectCard";
import DatabaseError from "./DatabaseError";

const BentoGrid = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProjects()
      .then(setProjects)
      .catch((err) => {
        console.error("Error loading projects:", err);
        setError(err.message || "Failed to load projects");
      })
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return <DatabaseError message={error} />;
  }

  if (loading) {
    return (
      <section className="py-12 px-[5%] max-w-[1200px] mx-auto">
        <div className="text-center text-muted-foreground">Loading projects...</div>
      </section>
    );
  }

  return (
    <section className="py-12 px-[5%] max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">{t.portfolio.latestWork}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] gap-5">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default BentoGrid;
