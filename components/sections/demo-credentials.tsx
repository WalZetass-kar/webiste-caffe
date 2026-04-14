import Link from "next/link";

export function DemoCredentials() {
  const roles = [
    {
      role: "Owner",
      access: "Full Access",
      description: "Complete dashboard access, manage all branches, view all reports",
      features: ["Dashboard", "Menu Management", "Staff Management", "Reports", "Settings"],
      color: "from-purple-500 to-indigo-600",
    },
    {
      role: "Manager",
      access: "Management Access",
      description: "Branch management, inventory, staff, and operational reports",
      features: ["Dashboard", "Branch Management", "Inventory", "Staff", "Reports"],
      color: "from-blue-500 to-cyan-600",
    },
    {
      role: "Cashier",
      access: "Order Access",
      description: "Create and manage orders, view menu, process payments",
      features: ["Orders", "Menu View", "Payments", "Receipts"],
      color: "from-green-500 to-emerald-600",
    },
    {
      role: "Kitchen",
      access: "Kitchen View",
      description: "View incoming orders, update order status, kitchen operations",
      features: ["Order Queue", "Status Update", "Kitchen Display"],
      color: "from-orange-500 to-red-600",
    },
  ];

  return (
    <section id="demo" className="section-shell py-20 sm:py-24">
      <div className="mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.34em] text-[#5a4a3a]">
          Try Live Demo
        </p>
        <h2 className="mt-3 text-4xl font-semibold text-[#3d3027] sm:text-5xl">
          Test All User Roles
        </h2>
        <p className="mt-4 text-lg text-[#6B5D52] max-w-3xl mx-auto">
          Explore the system from different perspectives dengan role-based access control
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {roles.map((item, index) => (
          <div
            key={item.role}
            className={`starbucks-card p-6 hover:shadow-2xl transition-all duration-300 animate-scale-in animate-delay-${index * 100}`}
          >
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white font-bold text-lg shadow-lg mb-4`}>
              {item.role.charAt(0)}
            </div>
            
            <h3 className="text-xl font-semibold text-[#3d3027] mb-1">
              {item.role}
            </h3>
            <p className="text-sm font-medium text-[#5a4a3a] mb-3">
              {item.access}
            </p>
            <p className="text-sm text-[#6B5D52] leading-relaxed mb-4">
              {item.description}
            </p>
            
            <div className="space-y-2 mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5a4a3a]">
                Features:
              </p>
              {item.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-[#6B5D52]">
                  <svg className="h-4 w-4 text-[#5a4a3a]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-3xl border border-[#D4C5B9]/40 bg-gradient-to-br from-white to-[#F7F5F2] p-8 shadow-lg">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h3 className="text-2xl font-semibold text-[#3d3027] mb-4">
              Ready to Explore?
            </h3>
            <p className="text-[#6B5D52] leading-relaxed mb-6">
              Klik tombol di bawah untuk masuk ke dashboard dan explore semua fitur. 
              Anda bisa switch role langsung dari dashboard untuk test different access levels.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#5a4a3a] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#6B5D52] hover:shadow-xl hover:-translate-y-1"
              >
                <span>Open Dashboard</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/order"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#5a4a3a] bg-transparent px-6 py-3 text-sm font-semibold text-[#5a4a3a] transition-all duration-300 hover:bg-[#5a4a3a] hover:text-white"
              >
                <span>Try Ordering</span>
              </Link>
            </div>
          </div>
          
          <div className="rounded-2xl border border-[#D4C5B9]/40 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#5a4a3a] mb-4">
              Quick Access
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#F7F5F2]">
                <span className="text-sm font-medium text-[#3d3027]">Default Role</span>
                <span className="text-sm text-[#5a4a3a]">Owner</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#F7F5F2]">
                <span className="text-sm font-medium text-[#3d3027]">Switch Role</span>
                <span className="text-sm text-[#5a4a3a]">From Dashboard</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#F7F5F2]">
                <span className="text-sm font-medium text-[#3d3027]">Sample Data</span>
                <span className="text-sm text-[#5a4a3a]">Included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
