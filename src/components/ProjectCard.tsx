import { Link } from "react-router-dom";
import { Project } from "@/lib/mockData";
import { useLanguage } from "@/i18n/LanguageContext";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const spanClass = `
    ${project.spanCols === 2 ? "md:col-span-2" : ""}
    ${project.spanRows === 2 ? "md:row-span-2 md:h-full" : ""}
  `;

  return (
    <Link
      to={`/project/${project.id}`}
      className={`group bg-card rounded-[20px] border border-border overflow-hidden relative cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-white/30 h-[250px] ${project.spanRows === 2 ? "md:h-[520px]" : ""} ${spanClass}`}
    >
      {project.coverImage ? (
        <img
          src={project.coverImage}
          alt={isAr ? project.title : project.titleEn}
          className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105 group-hover:opacity-80"
        />
      ) : (
        <div className="w-full h-full bg-black flex justify-center items-center">
          <span className="text-5xl">{project.icon || "📷"}</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-5 card-gradient z-[2]">
        <span className="tag">{isAr ? project.tag : project.tagEn}</span>
        <h3 className="mt-2.5 text-xl font-bold">
          {isAr ? project.title : project.titleEn}
        </h3>
      </div>
    </Link>
  );
};

export default ProjectCard;
