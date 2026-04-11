export const userRoleOptions = ["owner", "manager", "cashier", "barista", "kitchen"] as const;

export type UserRole = (typeof userRoleOptions)[number];

export const roleLabels: Record<UserRole, string> = {
  owner: "Owner",
  manager: "Manager",
  cashier: "Cashier",
  barista: "Barista",
  kitchen: "Kitchen",
};

const roleAccessMap: Record<UserRole, string[]> = {
  owner: ["/dashboard", "/menu", "/pesanan", "/cabang", "/supply", "/aset", "/staff", "/penilaian", "/laporan", "/identitas", "/audit"],
  manager: ["/dashboard", "/menu", "/pesanan", "/cabang", "/supply", "/aset", "/staff", "/penilaian", "/laporan", "/identitas", "/audit"],
  cashier: ["/pesanan", "/receipt", "/order"],
  barista: ["/pesanan", "/receipt"],
  kitchen: ["/pesanan", "/receipt"],
};

const publicPrefixes = ["/", "/order", "/receipt", "/penilaian", "/offline"];

function matchesPrefix(pathname: string, prefix: string) {
  if (prefix === "/") {
    return pathname === "/";
  }

  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function normalizeUserRole(value?: string | null): UserRole {
  if (!value) {
    return "owner";
  }

  return userRoleOptions.includes(value as UserRole) ? (value as UserRole) : "owner";
}

export function getDefaultRouteForRole(role: UserRole) {
  if (role === "owner" || role === "manager") {
    return "/dashboard";
  }

  return "/pesanan";
}

export function canAccessPath(role: UserRole, pathname: string) {
  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return true;
  }

  if (publicPrefixes.some((prefix) => matchesPrefix(pathname, prefix))) {
    return true;
  }

  return roleAccessMap[role].some((prefix) => matchesPrefix(pathname, prefix));
}

export function canCreateOrders(role: UserRole) {
  return role === "owner" || role === "manager" || role === "cashier";
}

export function canViewReports(role: UserRole) {
  return role === "owner" || role === "manager";
}

export function isProductionFloorRole(role: UserRole) {
  return role === "barista" || role === "kitchen";
}
