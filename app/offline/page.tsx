import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f5f2] px-4 py-10">
      <div className="max-w-lg rounded-[32px] bg-white p-8 text-center shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/62">Offline Mode</p>
        <h1 className="mt-3 text-4xl font-semibold text-cafe-text">CafeFlow tetap bisa dibuka.</h1>
        <p className="mt-4 text-sm leading-7 text-cafe-accent/78">
          Koneksi sedang tidak tersedia. Halaman yang pernah dibuka sebelumnya masih bisa dimuat dari cache.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-cafe-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7a623e]"
        >
          Kembali ke Homepage
        </Link>
      </div>
    </div>
  );
}
