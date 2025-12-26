import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { getHeroContent, updateHeroContent, HeroContent } from "@/lib/database";
import { toast } from "sonner";

const AdminHero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getHeroContent().then(setForm);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setLoading(true);
    await updateHeroContent(form);
    toast.success("Hero updated!");
    setLoading(false);
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">{t.admin.hero}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Badge (AR)</label>
            <input
              type="text"
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Badge (EN)</label>
            <input
              type="text"
              value={form.badgeEn}
              onChange={(e) => setForm({ ...form, badgeEn: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg"
            />
          </div>
        </div>

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
            <label className="block text-sm font-medium mb-2">Title Break (AR)</label>
            <input
              type="text"
              value={form.titleBreak}
              onChange={(e) => setForm({ ...form, titleBreak: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Title Break (EN)</label>
            <input
              type="text"
              value={form.titleBreakEn}
              onChange={(e) => setForm({ ...form, titleBreakEn: e.target.value })}
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
            <label className="block text-sm font-medium mb-2">CTA Primary (AR)</label>
            <input
              type="text"
              value={form.ctaPrimary}
              onChange={(e) => setForm({ ...form, ctaPrimary: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">CTA Primary (EN)</label>
            <input
              type="text"
              value={form.ctaPrimaryEn}
              onChange={(e) => setForm({ ...form, ctaPrimaryEn: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">CTA Secondary (AR)</label>
            <input
              type="text"
              value={form.ctaSecondary}
              onChange={(e) => setForm({ ...form, ctaSecondary: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">CTA Secondary (EN)</label>
            <input
              type="text"
              value={form.ctaSecondaryEn}
              onChange={(e) => setForm({ ...form, ctaSecondaryEn: e.target.value })}
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

export default AdminHero;
