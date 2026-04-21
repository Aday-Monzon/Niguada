import { PropsWithChildren, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export const AppShell = ({ children }: PropsWithChildren) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="page-shell">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed((value) => !value)}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar onToggleSidebar={() => setMobileOpen((value) => !value)} />
        <main className="flex-1 px-4 pb-8 pt-6 md:px-8">{children}</main>
      </div>
    </div>
  );
};
