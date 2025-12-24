import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Folder, Layout, MessageSquare, LogOut } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { logoutUser } from "@/lib/supabaseClient";

const AdminSidebar = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/admin/login");
  };

  const navItems = [
    { to: "/admin", icon: LayoutDashboard, label: t.admin.dashboard },
    { to: "/admin/projects", icon: Folder, label: t.admin.projects },
    { to: "/admin/hero", icon: Layout, label: t.admin.hero },
    { to: "/admin/footer", icon: MessageSquare, label: t.admin.footerCta },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="mb-8">
        <Link to="/" className="font-black text-xl">
          📷 Admin
        </Link>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`admin-nav-item ${isActive ? "active" : ""}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8">
        <button
          onClick={handleLogout}
          className="admin-nav-item w-full text-destructive hover:bg-destructive/10"
        >
          <LogOut size={20} />
          <span>{t.admin.logout}</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
