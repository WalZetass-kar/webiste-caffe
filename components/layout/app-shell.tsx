import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F5F2] via-[#E8DDD3] to-[#F7F5F2]">
      {/* Subtle background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-6rem] top-[-4rem] h-64 w-64 rounded-full bg-[#5a4a3a]/8 blur-3xl" />
        <div className="absolute bottom-[-6rem] right-[-3rem] h-72 w-72 rounded-full bg-[#3d3027]/6 blur-3xl" />
      </div>
      
      <DashboardSidebar />
      
      <div className="relative lg:ml-[240px]">
        <div className="relative z-10 flex min-h-screen flex-col gap-6 px-3 py-3 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
          <Topbar />
          <MobileNav />
          <main className="relative z-10 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
