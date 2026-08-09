import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const movie = await prisma.movie.findUnique({
      where: { id },
      include: {
        showtimes: {
          include: {
            cinema: true,
            hall: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: { name: true, avatarUrl: true },
            },
          },
        },
      },
    });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
