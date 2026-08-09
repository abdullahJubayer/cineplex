import { NextResponse } from "next/server";

export function checkAdminAuth(req: Request): { authorized: boolean; response?: NextResponse } {
  // Check for admin role header or token in API request
  const authHeader = req.headers.get("authorization");
  const roleHeader = req.headers.get("x-user-role");
  const adminSecret = process.env.ADMIN_SECRET || "admin-secret-key-123";

  // Allow requests with admin role header or bearer token
  if (roleHeader === "ADMIN" || authHeader === `Bearer ${adminSecret}`) {
    return { authorized: true };
  }

  // Allow browser fetch requests when user agent is present in dev
  const isDev = process.env.NODE_ENV !== "production";
  if (isDev && req.headers.get("user-agent")) {
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
