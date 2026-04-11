import "server-only";

import { cookies } from "next/headers";
import { normalizeUserRole } from "@/lib/auth/roles";

export async function getCurrentUserRole() {
  const cookieStore = await cookies();

  return normalizeUserRole(cookieStore.get("cafeflow-role")?.value);
}
