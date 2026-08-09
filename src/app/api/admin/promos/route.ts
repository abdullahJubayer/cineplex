import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminAuth } from "@/lib/adminAuth";

export async function GET(req: Request) {
  const auth = checkAdminAuth(req);
  if (!auth.authorized) return auth.response!;

  try {
    const promos = await prisma.promoCode.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(promos);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch promo codes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = checkAdminAuth(req);
  if (!auth.authorized) return auth.response!;

  try {
    const body = await req.json();
    const { code, discountType = "PERCENTAGE", amount, usageLimit = 100, expiresAt } = body;

    if (!code || !amount) {
      return NextResponse.json({ error: "Missing required promo code fields" }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    // Check uniqueness
    const existing = await prisma.promoCode.findUnique({ where: { code: cleanCode } });
    if (existing) {
      return NextResponse.json({ error: "Promo code already exists" }, { status: 409 });
    }

    const promo = await prisma.promoCode.create({
      data: {
        code: cleanCode,
        discountType,
        amount: Number(amount),
        usageLimit: Number(usageLimit),
        expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json(promo, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create promo code" }, { status: 500 });
  }
}
