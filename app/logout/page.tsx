"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear role cookie
    document.cookie = "cafeflow-role=; path=/; max-age=0";
    
    // Redirect to login
    router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3e2723] to-[#4e342e] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#d7ccc8]/40 bg-[#5d4037]/30 text-xl font-bold text-[#d7ccc8] mb-4 animate-pulse">
          CF
        </div>
        <p className="text-[#d7ccc8]">Logging out...</p>
      </div>
    </div>
  );
}
