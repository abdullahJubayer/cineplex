import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get("movieId");
  const dateStr = searchParams.get("date"); // YYYY-MM-DD

  const where: any = {};
  if (movieId) where.movieId = movieId;

  try {
    const showtimes = await prisma.showtime.findMany({
      where,
      include: {
        movie: true,
        cinema: true,
        hall: true,
      },
      orderBy: { startTime: "asc" },
    });
    return NextResponse.json(showtimes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
