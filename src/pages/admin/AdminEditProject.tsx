import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { getProject, createProject, updateProject, Project } from "@/lib/mockData";
import { processImageFiles, UploadedImage } from "@/lib/imageUpload";
import { toast } from "sonner";

const AdminEditProject = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isNew = id === "new";

  const [form, setForm] = useState({
    title: "",
    titleEn: "",
    tag: "",
    tagEn: "",
    description: "",
    descriptionEn: "",
    coverImage: "",
    images: [] as string[],
    spanCols: 1,
    spanRows: 1,
    icon: "",
  });

  const [newImages, setNewImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      getProject(id).then((project) => {
        if (project) {
          setForm({
            title: project.title,
            titleEn: project.titleEn,
            tag: project.tag,
            tagEn: project.tagEn,
            description: project.description || "",
            descriptionEn: project.descriptionEn || "",
            coverImage: project.coverImage,
            images: project.images,
            spanCols: project.spanCols || 1,
            spanRows: project.spanRows || 1,
            icon: project.icon || "",
          });
        }
      });
    }
  }, [id, isNew]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploaded = await processImageFiles(e.target.files);
      setNewImages((prev) => [...prev, ...uploaded]);
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploaded.map((u) => u.preview)],
      }));
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const [uploaded] = await processImageFiles(e.target.files);
      setForm((prev) => ({ ...prev, coverImage: uploaded.preview }));
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isNew) {
        await createProject(form as Omit<Project, "id">);
        toast.success("Project created!");
      } else if (id) {
        await updateProject(id, form);
        toast.success("Project updated!");
      }
      navigate("/admin/projects");
    } catch (error) {
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">
        {isNew ? t.admin.add : t.admin.edit} {t.admin.projects}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t.admin.title} (AR)
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              {t.admin.title} (EN)
            </label>
            <input
              type="text"
              value={form.titleEn}
              onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t.admin.tag} (AR)
            </label>
            <input
              type="text"
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              {t.admin.tag} (EN)
            </label>
            <input
              type="text"
              value={form.tagEn}
              onChange={(e) => setForm({ ...form, tagEn: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t.admin.description} (AR)
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              {t.admin.description} (EN)
            </label>
            <textarea
              value={form.descriptionEn}
              onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg"
              rows={3}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Span Columns</label>
            <select
              value={form.spanCols}
              onChange={(e) => setForm({ ...form, spanCols: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Span Rows</label>
            <select
              value={form.spanRows}
              onChange={(e) => setForm({ ...form, spanRows: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Icon (emoji)</label>
          <input
            type="text"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="w-full px-4 py-3 bg-secondary border border-border rounded-lg"
            placeholder="👁️"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cover Image</label>
          <div className="flex items-center gap-4">
            {form.coverImage && (
              <img
                src={form.coverImage}
                alt="Cover"
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
            <label className="cursor-pointer flex items-center gap-2 px-4 py-3 bg-secondary border border-border rounded-lg hover:bg-secondary/80">
              <Upload size={20} />
              <span>{t.admin.uploadImages}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t.admin.images}</label>
          <div className="flex flex-wrap gap-4 mb-4">
            {form.images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <label className="cursor-pointer flex items-center gap-2 px-4 py-3 bg-secondary border border-border rounded-lg hover:bg-secondary/80 w-fit">
            <Upload size={20} />
            <span>{t.admin.uploadImages}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary disabled:opacity-50"
          >
            {loading ? "..." : t.admin.save}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/projects")}
            className="btn btn-secondary"
          >
            {t.admin.cancel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditProject;
