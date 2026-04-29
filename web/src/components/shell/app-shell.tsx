"use client";

import { ReactNode } from "react";
import { SidebarNav } from "@/components/shell/sidebar-nav";
import { TopBar } from "@/components/shell/top-bar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[72px_1fr] md:gap-8">
          <SidebarNav />
          <div className="min-w-0">
            <TopBar />
            <main className="mt-6 min-w-0">{children}</main>
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <SidebarNav variant="bottom" />
      </div>
    </div>
  );
}

