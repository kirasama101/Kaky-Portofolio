import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Folder, Layout, MessageSquare } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { getProjectsList } from "@/lib/database";

const Dashboard = () => {
  const { t } = useLanguage();
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    getProjectsList().then((p) => setProjectCount(p.length));
  }, []);

  const cards = [
    {
      to: "/admin/projects",
      icon: Folder,
      label: t.admin.projects,
      count: projectCount,
    },
    {
      to: "/admin/hero",
      icon: Layout,
      label: t.admin.hero,
    },
    {
      to: "/admin/footer",
      icon: MessageSquare,
      label: t.admin.footerCta,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{t.admin.welcome}</h1>
      <p className="text-muted-foreground mb-8">{t.admin.manageContent}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="bg-card border border-border rounded-xl p-6 hover:border-white/30 transition-colors"
          >
            <card.icon className="text-primary mb-4" size={32} />
            <h3 className="text-xl font-bold">{card.label}</h3>
            {card.count !== undefined && (
              <p className="text-muted-foreground mt-2">{card.count} items</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
