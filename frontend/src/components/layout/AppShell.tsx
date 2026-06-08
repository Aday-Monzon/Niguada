import { PropsWithChildren, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export const AppShell = ({ children }: PropsWithChildren) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed((value) => !value)}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col px-4 py-4 md:pl-4 md:pr-6 lg:pr-8">
        <Topbar onToggleSidebar={() => setMobileOpen((value) => !value)} />
        <main className="mx-auto w-full max-w-7xl flex-1 pb-10 pt-6">{children}</main>
      </div>
    </div>
  );
};
