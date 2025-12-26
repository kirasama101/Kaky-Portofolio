import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { getFooterContent, updateFooterContent, FooterContent } from "@/lib/database";
import { toast } from "sonner";

const AdminFooter = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState<FooterContent | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFooterContent().then(setForm);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setLoading(true);
    await updateFooterContent(form);
    toast.success("Footer updated!");
    setLoading(false);
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">{t.admin.footerCta}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t.admin.title} (AR)</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t.admin.title} (EN)</label>
            <input
              type="text"
              value={form.titleEn}
              onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t.admin.description} (AR)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t.admin.description} (EN)</label>
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
            <label className="block text-sm font-medium mb-2">CTA (AR)</label>
            <input
              type="text"
              value={form.cta}
              onChange={(e) => setForm({ ...form, cta: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">CTA (EN)</label>
            <input
              type="text"
              value={form.ctaEn}
              onChange={(e) => setForm({ ...form, ctaEn: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg"
            />
          </div>
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
            onClick={() => navigate("/admin")}
            className="btn btn-secondary"
          >
            {t.admin.cancel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminFooter;
