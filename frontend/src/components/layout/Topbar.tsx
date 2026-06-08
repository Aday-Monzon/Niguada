import { CalendarDays, LogOut, Menu, UserCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";
import { cn } from "../../lib/utils/cn";

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
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/85 px-4 py-3 shadow-sm backdrop-blur md:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-100 hover:text-slate-950 md:hidden"
          onClick={onToggleSidebar}
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" strokeWidth={1.9} />
        </button>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Workspace</p>
          <h2 className="truncate font-display text-xl font-semibold text-slate-950 md:text-2xl">
            {pageTitles[location.pathname] ?? "Niguada CRM"}
          </h2>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="hidden items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-600 lg:flex">
          <CalendarDays className="h-4 w-4" strokeWidth={1.9} />
          <span>{today}</span>
        </div>
        <div className="hidden items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 md:flex">
          <UserCircle className="h-4 w-4 text-zinc-500" strokeWidth={1.9} />
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold text-slate-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">{user?.role}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className={cn(
            "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-700 transition",
            "hover:bg-zinc-100 hover:text-slate-950"
          )}
        >
          <LogOut className="h-4 w-4" strokeWidth={1.9} />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  );
};
