import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const where: any = {};
  if (status) {
    where.status = status;
  }
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { genres: { contains: search } },
      { director: { contains: search } },
    ];
  }

  try {
    const movies = await prisma.movie.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(movies);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
