export function TechStack() {
  const technologies = [
    {
      category: "Frontend",
      items: [
        { name: "Next.js 16", description: "React framework with App Router" },
        { name: "React 19", description: "Latest React with Server Components" },
        { name: "TypeScript", description: "Type-safe development" },
        { name: "Tailwind CSS", description: "Utility-first CSS framework" },
      ],
    },
    {
      category: "UI/UX",
      items: [
        { name: "Chart.js", description: "Interactive charts and graphs" },
        { name: "React Hook Form", description: "Performant form validation" },
        { name: "Zod", description: "Schema validation" },
        { name: "FontAwesome", description: "Icon library" },
      ],
    },
    {
      category: "Features",
      items: [
        { name: "PWA Support", description: "Progressive Web App ready" },
        { name: "Real-time Notifications", description: "Browser & toast notifications" },
        { name: "Export to Excel/CSV", description: "Data export functionality" },
        { name: "Role-based Access", description: "5 user roles with permissions" },
      ],
    },
    {
      category: "Developer Experience",
      items: [
        { name: "ESLint", description: "Code linting" },
        { name: "Vitest", description: "Unit testing framework" },
        { name: "Clean Code", description: "Well-organized and documented" },
        { name: "TypeScript Strict", description: "Maximum type safety" },
      ],
    },
  ];

  return (
    <section className="bg-gradient-to-br from-[#3d3027] to-[#0c1a1f] py-20 text-white sm:py-24">
      <div className="section-shell">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-[#CBA258]">
            Technology Stack
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
            Built with Modern Technologies
          </h2>
          <p className="mt-4 text-lg text-white/70 max-w-3xl mx-auto">
            Production-ready stack dengan best practices dan latest versions
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {technologies.map((tech, index) => (
            <div
              key={tech.category}
              className={`rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm animate-fade-in animate-delay-${index * 100}`}
            >
              <h3 className="text-xl font-semibold text-[#CBA258] mb-4">
                {tech.category}
              </h3>
              <div className="space-y-4">
                {tech.items.map((item) => (
                  <div key={item.name}>
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-white/60 mt-1">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
            <p className="text-4xl font-bold text-[#CBA258]">100%</p>
            <p className="mt-2 text-sm text-white/70">TypeScript Coverage</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
            <p className="text-4xl font-bold text-[#CBA258]">50+</p>
            <p className="mt-2 text-sm text-white/70">Components</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
            <p className="text-4xl font-bold text-[#CBA258]">15+</p>
            <p className="mt-2 text-sm text-white/70">Pages</p>
          </div>
        </div>
      </div>
    </section>
  );
}
