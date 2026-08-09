import { NextResponse } from "next/server";

export function checkAdminAuth(req: Request): { authorized: boolean; response?: NextResponse } {
  // Check for admin role header or token in API request
  const authHeader = req.headers.get("authorization");
  const roleHeader = req.headers.get("x-user-role");
  const adminSecret = process.env.ADMIN_SECRET || "admin-secret-key-123";

  if (roleHeader === "ADMIN" || authHeader === `Bearer ${adminSecret}`) {
    return { authorized: true };
  }

  // Allow internal server requests in dev mode
  const isDev = process.env.NODE_ENV !== "production";
  if (isDev && req.headers.get("user-agent")?.includes("Mozilla")) {
    return { authorized: true };
  }

  return {
    authorized: false,
    response: NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    ),
  };
}
