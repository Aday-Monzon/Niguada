import { NavLink } from "react-router-dom";
import { navigationItems } from "../../lib/constants/navigation";
import { cn } from "../../lib/utils/cn";

const iconMap: Record<string, JSX.Element> = {
  grid: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2 9.2 9.2 2 12l7.2 2.8L12 22l2.8-7.2L22 12l-7.2-2.8L12 2Z" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m9 12 2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
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
  return (
    <>
      {mobileOpen ? <div className="fixed inset-0 z-30 bg-slate-950/45 md:hidden" onClick={onCloseMobile} /> : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/50 bg-slate-950 px-4 py-6 text-white transition-all duration-300 md:static",
          mobileOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full md:translate-x-0",
          collapsed ? "md:w-24" : "md:w-72"
        )}
      >
      <div className="mb-8 flex items-center justify-between gap-3">
        <div className={cn("transition-all", collapsed && "opacity-0")}>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Niguada</p>
          <h1 className="font-display text-2xl font-bold">CRM Suite</h1>
        </div>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
        >
          {collapsed ? ">>" : "<<"}
        </button>
      </div>

      <nav className="space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                isActive ? "bg-white text-slate-900" : "text-slate-300 hover:bg-white/10 hover:text-white"
              )
            }
          >
            {iconMap[item.icon]}
            {!collapsed ? <span>{item.label}</span> : null}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl bg-white/5 p-4 text-sm text-slate-300">
        <p className="font-semibold text-white">Pipeline listo</p>
        {!collapsed ? (
          <p className="mt-2 text-xs leading-6 text-slate-400">
            Un panel ligero para ventas, seguimiento y operación comercial.
          </p>
        ) : null}
      </div>
      </aside>
    </>
  );
};
