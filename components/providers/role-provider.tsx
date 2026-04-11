"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { normalizeUserRole, type UserRole } from "@/lib/auth/roles";

type RoleContextValue = {
  role: UserRole;
  setRole: (next: UserRole) => void;
};

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({
  initialRole,
  children,
}: {
  initialRole: UserRole;
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<UserRole>(normalizeUserRole(initialRole));

  useEffect(() => {
    document.cookie = `cafeflow-role=${role}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
  }, [role]);

  const value = useMemo(
    () => ({
      role,
      setRole,
    }),
    [role],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useUserRole() {
  const context = useContext(RoleContext);

  if (!context) {
    throw new Error("useUserRole harus digunakan di dalam RoleProvider.");
  }

  return context;
}
