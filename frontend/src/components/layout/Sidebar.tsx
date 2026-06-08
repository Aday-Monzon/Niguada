import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  FolderKanban,
  LayoutDashboard,
  Sparkles,
  Users,
  type LucideIcon
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { PintaderaLogo } from "../brand/PintaderaLogo";
import { navigationItems } from "../../lib/constants/navigation";
import { cn } from "../../lib/utils/cn";

const iconMap: Record<string, LucideIcon> = {
  grid: LayoutDashboard,
  users: Users,
  spark: Sparkles,
  check: CircleCheck
};

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
};

export const Sidebar = ({
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile
}: SidebarProps) => {
  const showLabels = !collapsed || mobileOpen;

  return (
    <>
      {mobileOpen ? <div className="fixed inset-0 z-30 bg-slate-950/30 backdrop-blur-sm md:hidden" onClick={onCloseMobile} /> : null}
      <aside
        className={cn(
          "fixed bottom-0 left-0 top-0 z-40 flex flex-col border-r border-zinc-200 bg-white px-3 py-4 text-slate-700 shadow-xl shadow-slate-950/5 transition-all duration-300 md:sticky md:bottom-auto md:left-auto md:top-4 md:ml-4 md:h-[calc(100vh-2rem)] md:rounded-2xl md:border md:shadow-sm",
          mobileOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full md:translate-x-0",
          collapsed ? "md:w-20" : "md:w-72"
        )}
      >
        <div className="mb-6 flex items-center justify-between gap-3 px-2">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
              <PintaderaLogo className="h-[22px] w-[22px] text-white" />
            </div>
            {showLabels ? (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">Niguada CRM</p>
                <p className="truncate text-xs text-zinc-500">Workspace comercial</p>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-slate-900 md:inline-flex"
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="space-y-1.5">
          {navigationItems.map((item) => {
            const Icon = iconMap[item.icon];

            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={item.label}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    "group flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
                    collapsed && !mobileOpen && "md:justify-center md:px-0",
                    isActive
                      ? "bg-slate-950 text-white shadow-sm"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-slate-950"
                  )
                }
              >
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.9} />
                {showLabels ? <span className="truncate">{item.label}</span> : null}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
              <FolderKanban className="h-[18px] w-[18px]" strokeWidth={1.9} />
            </div>
            {showLabels ? (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">Pipeline listo</p>
                <p className="mt-0.5 truncate text-xs text-zinc-500">Ventas y operación al día</p>
              </div>
            ) : null}
          </div>
        </div>
      </aside>
    </>
  );
};
