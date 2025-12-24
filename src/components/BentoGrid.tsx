import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { getProjects, Project } from "@/lib/mockData";
import ProjectCard from "./ProjectCard";

const BentoGrid = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

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
