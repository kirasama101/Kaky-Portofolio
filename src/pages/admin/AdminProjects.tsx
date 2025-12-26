import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { getProjects, deleteProject, Project } from "@/lib/database";
import { toast } from "sonner";

const AdminProjects = () => {
  const { t, language } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);

  const isAr = language === "ar";

  const loadProjects = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await deleteProject(id);
      toast.success("Project deleted");
      loadProjects();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t.admin.projects}</h1>
        <Link
          to="/admin/projects/new"
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          {t.admin.add}
        </Link>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
          >
            {project.coverImage ? (
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
            ) : (
              <div className="w-20 h-20 bg-secondary rounded-lg flex items-center justify-center text-2xl">
                {project.icon || "📷"}
              </div>
            )}

            <div className="flex-1">
              <h3 className="font-bold">
                {isAr ? project.title : project.titleEn}
              </h3>
              <span className="text-sm text-muted-foreground">
                {isAr ? project.tag : project.tagEn}
              </span>
            </div>

            <div className="flex gap-2">
              <Link
                to={`/admin/projects/${project.id}`}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <Pencil size={20} />
              </Link>
              <button
                onClick={() => handleDelete(project.id)}
                className="p-2 hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProjects;
