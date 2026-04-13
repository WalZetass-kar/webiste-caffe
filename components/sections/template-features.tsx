export function TemplateFeatures() {
  const features = [
    {
      title: "Real-time Order Management",
      description: "Kelola pesanan secara real-time dengan notifikasi instant dan status tracking",
      icon: "",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Multi-branch Support",
      description: "Manage multiple cafe locations dengan satu dashboard terpusat",
      icon: "",
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Inventory Tracking",
      description: "Track stok bahan baku dengan alert otomatis untuk restock",
      icon: "",
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Staff Management",
      description: "Kelola karyawan, attendance, dan role-based access control",
      icon: "",
      color: "from-orange-500 to-red-600",
    },
    {
      title: "Sales Analytics",
      description: "Dashboard analytics dengan chart interaktif dan export reports",
      icon: "",
      color: "from-indigo-500 to-purple-600",
    },
    {
      title: "Customer Ratings",
      description: "Sistem rating dan review untuk meningkatkan service quality",
      icon: "",
      color: "from-yellow-500 to-orange-600",
    },
    {
      title: "PWA Support",
      description: "Progressive Web App untuk pengalaman mobile yang optimal",
      icon: "",
      color: "from-teal-500 to-green-600",
    },
    {
      title: "Export Reports",
      description: "Export data ke Excel, CSV, dan PDF untuk reporting",
      icon: "",
      color: "from-pink-500 to-rose-600",
    },
    {
      title: "Audit Logs",
      description: "Track semua aktivitas user untuk security dan compliance",
      icon: "",
      color: "from-gray-500 to-slate-600",
    },
    {
      title: "Responsive Design",
      description: "Perfect di semua device: desktop, tablet, dan mobile",
      icon: "",
      color: "from-cyan-500 to-blue-600",
    },
    {
      title: "TypeScript",
      description: "Type-safe code dengan TypeScript untuk maintainability",
      icon: "",
      color: "from-blue-600 to-indigo-600",
    },
    {
      title: "Modern Stack",
      description: "Built dengan Next.js 16, React 19, dan Tailwind CSS",
      icon: "",
      color: "from-violet-500 to-purple-600",
    },
  ];

  return (
    <section className="section-shell py-20 sm:py-24">
      <div className="mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.34em] text-[#00704A]">
          Template Features
        </p>
        <h2 className="mt-3 text-4xl font-semibold text-[#1E3932] sm:text-5xl">
          Everything You Need to Run a Modern Cafe
        </h2>
        <p className="mt-4 text-lg text-[#6B5D52] max-w-3xl mx-auto">
          Complete cafe management system dengan fitur-fitur professional yang siap pakai
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className={`group starbucks-card p-6 hover:shadow-2xl transition-all duration-300 animate-scale-in animate-delay-${(index % 4) * 100}`}
          >
            <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-3xl shadow-lg mb-4`}>
              {/* Icon removed */}
            </div>
            <h3 className="text-lg font-semibold text-[#1E3932] mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-[#6B5D52] leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <a
          href="#demo"
          className="inline-flex items-center gap-2 rounded-full bg-[#00704A] px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#00A862] hover:shadow-xl hover:-translate-y-1"
        >
          <span>View Live Demo</span>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </div>
    </section>
  );
}
