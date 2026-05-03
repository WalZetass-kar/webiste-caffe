"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useUserRole } from "@/components/providers/role-provider";
import { getDefaultRouteForRole, roleLabels, type UserRole } from "@/lib/auth/roles";

const demoAccounts = [
  { username: "owner", password: "owner123", role: "owner" as UserRole },
  { username: "manager", password: "manager123", role: "manager" as UserRole },
  { username: "cashier", password: "cashier123", role: "cashier" as UserRole },
  { username: "barista", password: "barista123", role: "barista" as UserRole },
  { username: "kitchen", password: "kitchen123", role: "kitchen" as UserRole },
];

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useUserRole();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const account = demoAccounts.find(
      (acc) => acc.username === username && acc.password === password
    );

    if (account) {
      setRole(account.role);
      const route = getDefaultRouteForRole(account.role);
      router.push(route);
    } else {
      setError("Username atau password salah");
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    setRole(role);
    const route = getDefaultRouteForRole(role);
    router.push(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3e2723] to-[#4e342e] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#d7ccc8]/40 bg-[#5d4037]/30 text-xl font-bold text-[#d7ccc8] mb-4">
            CF
          </div>
          <h1 className="text-3xl font-bold text-[#efebe9]">CafeFlow</h1>
          <p className="mt-2 text-sm text-[#d7ccc8]/70">Sistem Manajemen Cafe</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm p-6 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4e342e] mb-2">
                Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4e342e] mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Masuk..." : "Login"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#bcaaa4]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-[#6d4c41]">Atau login sebagai</span>
            </div>
          </div>

          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <button
                key={account.role}
                type="button"
                onClick={() => handleDemoLogin(account.role)}
                className="w-full rounded-lg border border-[#bcaaa4] bg-[#efebe9] px-4 py-3 text-left text-sm font-medium text-[#4e342e] transition hover:bg-[#e8ddd3] hover:border-[#8d6e63]"
              >
                <div className="flex items-center justify-between">
                  <span>{roleLabels[account.role]}</span>
                  <span className="text-xs text-[#8d6e63]">
                    {account.username} / {account.password}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-[#d7ccc8]/70 hover:text-[#efebe9] transition"
          >
            ← Kembali ke Website
          </Link>
        </div>
      </div>
    </div>
  );
}
