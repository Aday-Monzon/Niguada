import { useLocation } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";
import { Button } from "../ui/Button";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/clients": "Clientes",
  "/opportunities": "Oportunidades",
  "/tasks": "Tareas"
};

type TopbarProps = {
  onToggleSidebar: () => void;
};

export const Topbar = ({ onToggleSidebar }: TopbarProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const today = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date());

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/60 bg-white/75 px-4 py-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 md:hidden"
          onClick={onToggleSidebar}
        >
          Menu
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Workspace</p>
          <h2 className="font-display text-2xl font-bold text-slate-900">
            {pageTitles[location.pathname] ?? "Niguada CRM"}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-2 text-right md:block">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Hoy</p>
          <p className="text-sm font-semibold text-slate-800">{today}</p>
        </div>
        <div className="hidden rounded-2xl bg-slate-100 px-4 py-2 text-right md:block">
          <p className="text-sm font-semibold text-slate-800">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{user?.role}</p>
        </div>
        <Button variant="ghost" onClick={logout}>
          Salir
        </Button>
      </div>
    </header>
  );
};
