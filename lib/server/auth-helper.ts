import "server-only";

import { cookies } from "next/headers";
import { normalizeUserRole, type UserRole } from "@/lib/auth/roles";

export type AuditUser = {
  id: string;
  name: string;
  role: UserRole;
};

/**
 * Get current user info for audit logging
 * In production, this should get user from session/JWT
 * For now, we use role from cookie and generate a simple user ID
 */
export async function getAuditUser(): Promise<AuditUser> {
  const cookieStore = await cookies();
  const role = normalizeUserRole(cookieStore.get("cafeflow-role")?.value);
  
  // In production, get actual user ID and name from session
  // For now, generate based on role
  return {
    id: `user-${role}`,
    name: role.charAt(0).toUpperCase() + role.slice(1),
    role,
  };
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  return realIP || undefined;
}

/**
 * Get user agent from request
 */
export function getUserAgent(request: Request): string | undefined {
  return request.headers.get("user-agent") || undefined;
}
