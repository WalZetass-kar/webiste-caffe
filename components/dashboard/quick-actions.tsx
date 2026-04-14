"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";

export function QuickActions() {
  const actions = [
    {
      title: "Buat Pesanan",
      description: "Tambah order baru",
      href: "/order",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      color: "from-[#5a4a3a] to-[#6B5D52]",
    },
    {
      title: "Kelola Menu",
      description: "Edit menu & harga",
      href: "/menu",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: "from-[#CBA258] to-[#D4A574]",
    },
    {
      title: "Stok Bahan",
      description: "Cek & restock",
      href: "/supply",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: "from-[#3d3027] to-[#2A4F47]",
    },
    {
      title: "Kelola Staff",
      description: "Absensi & jadwal",
      href: "/staff",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: "from-[#6B5D52] to-[#8B7D72]",
    },
    {
      title: "Laporan",
      description: "Export & analisis",
      href: "/laporan",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "from-[#5a4a3a] to-[#3d3027]",
    },
    {
      title: "Pengaturan",
      description: "Konfigurasi cafe",
      href: "/identitas",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: "from-[#9B8B7E] to-[#B5A599]",
    },
  ];

  return (
    <Card className="starbucks-card">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#5a4a3a]">
          Quick Actions
        </p>
        <h3 className="mt-1 text-xl font-bold text-[#3d3027]">
          Akses cepat ke fitur utama
        </h3>
      </div>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="group relative overflow-hidden rounded-2xl border border-[#D4C5B9]/40 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} text-white shadow-md mb-3 transition-transform duration-300 group-hover:scale-110`}>
              {action.icon}
            </div>
            <h4 className="text-sm font-semibold text-[#3d3027] mb-1 truncate">
              {action.title}
            </h4>
            <p className="text-xs text-[#6B5D52] truncate">
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </Card>
  );
}
