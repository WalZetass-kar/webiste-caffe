"use client";

import { useState } from "react";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What's included in the template?",
      answer: "Complete cafe management system dengan 15+ pages, 50+ components, dashboard analytics, order management, inventory tracking, staff management, customer ratings, export reports, audit logs, dan PWA support. Semua source code included dengan dokumentasi lengkap.",
    },
    {
      question: "Is database included?",
      answer: "Template ini menggunakan JSON files untuk data storage, perfect untuk demo dan development. Anda bisa dengan mudah migrate ke database (PostgreSQL, MySQL, MongoDB) sesuai kebutuhan. Dokumentasi migration guide included.",
    },
    {
      question: "Can I customize the design?",
      answer: "Absolutely! Template ini built dengan Tailwind CSS yang sangat mudah di-customize. Semua colors, spacing, dan styling bisa diubah melalui config file. Source code lengkap included tanpa obfuscation.",
    },
    {
      question: "Is support included?",
      answer: "Ya, kami provide email support untuk technical questions dan bug fixes. Response time biasanya 24-48 jam. Documentation lengkap juga tersedia untuk self-help.",
    },
    {
      question: "Do I get updates?",
      answer: "Ya, semua buyers mendapat free updates untuk bug fixes dan minor improvements. Major version updates mungkin require additional fee, tapi existing version tetap fully functional.",
    },
    {
      question: "What's the refund policy?",
      answer: "Kami offer 14-day money-back guarantee jika template tidak sesuai dengan yang dijelaskan. Refund hanya berlaku jika ada technical issues yang tidak bisa kami resolve.",
    },
    {
      question: "Can I use this for client projects?",
      answer: "Ya, dengan regular license Anda bisa use template ini untuk unlimited client projects. Extended license required jika Anda mau resell template ini as-is atau sebagai part of SaaS product.",
    },
    {
      question: "Is this SEO optimized?",
      answer: "Template ini built dengan Next.js yang SEO-friendly by default. Includes proper meta tags, semantic HTML, fast loading times, dan mobile optimization. Anda tinggal customize content untuk SEO needs Anda.",
    },
  ];

  return (
    <section className="section-shell py-20 sm:py-24">
      <div className="mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.34em] text-[#5a4a3a]">
          FAQ
        </p>
        <h2 className="mt-3 text-4xl font-semibold text-[#3d3027] sm:text-5xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-lg text-[#6B5D52] max-w-3xl mx-auto">
          Pertanyaan yang sering ditanyakan tentang template ini
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`starbucks-card overflow-hidden transition-all duration-300 animate-fade-in animate-delay-${index * 50}`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between gap-4 p-6 text-left"
            >
              <h3 className="text-lg font-semibold text-[#3d3027]">
                {faq.question}
              </h3>
              <svg
                className={`h-6 w-6 flex-shrink-0 text-[#5a4a3a] transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="border-t border-[#D4C5B9]/30 px-6 pb-6 pt-4">
                <p className="text-[#6B5D52] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-[#6B5D52] mb-4">
          Masih ada pertanyaan?
        </p>
        <a
          href="mailto:support@example.com"
          className="inline-flex items-center gap-2 rounded-full border-2 border-[#5a4a3a] bg-transparent px-6 py-3 text-sm font-semibold text-[#5a4a3a] transition-all duration-300 hover:bg-[#5a4a3a] hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Contact Support</span>
        </a>
      </div>
    </section>
  );
}
