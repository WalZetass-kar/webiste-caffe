import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cafe-background bg-soft-mesh">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-6rem] top-[-4rem] h-64 w-64 rounded-full bg-cafe-secondary/38 blur-3xl" />
        <div className="absolute bottom-[-6rem] right-[-3rem] h-72 w-72 rounded-full bg-cafe-primary/18 blur-3xl" />
      </div>
      <div className="relative mx-auto flex max-w-[1600px] gap-4 px-3 py-3 sm:px-4 sm:py-5 lg:gap-6 lg:px-6 lg:py-6">
        <DashboardSidebar />
        <div className="relative z-10 flex min-h-[calc(100vh-2.5rem)] flex-1 flex-col gap-6">
          <Topbar />
          <MobileNav />
          <main className="relative z-10 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
