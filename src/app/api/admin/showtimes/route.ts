import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminAuth } from "@/lib/adminAuth";

export async function GET(req: Request) {
  const auth = checkAdminAuth(req);
  if (!auth.authorized) return auth.response!;

  try {
    const showtimes = await prisma.showtime.findMany({
      include: {
        movie: true,
        cinema: true,
        hall: true,
      },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json(showtimes);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch showtimes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = checkAdminAuth(req);
  if (!auth.authorized) return auth.response!;

  try {
    const body = await req.json();
    const { movieId, cinemaId, hallId, startTime, format = "Digital 3D", basePrice = 16.5 } = body;

    let targetCinemaId = cinemaId;
    if (!targetCinemaId) {
      const firstCinema = await prisma.cinema.findFirst();
      targetCinemaId = firstCinema?.id;
    }

    if (!movieId || !targetCinemaId || !startTime) {
      return NextResponse.json({ error: "Missing required showtime details (movieId, cinemaId, or startTime)" }, { status: 400 });
    }

    const start = new Date(startTime);
    if (isNaN(start.getTime())) {
      return NextResponse.json({ error: "Invalid start time format" }, { status: 400 });
    }

    // Fetch movie duration to calculate end time
    const movie = await prisma.movie.findUnique({ where: { id: movieId } });
    if (!movie) {
      return NextResponse.json({ error: "Movie not found in catalog" }, { status: 404 });
    }

    const durationMins = movie.durationMins || 120;
    const cleanupBufferMins = 20;
    const end = new Date(start.getTime() + (durationMins + cleanupBufferMins) * 60 * 1000);

    // Overlap Validation Check: Check if another showtime overlaps on the same hall/cinema
    const targetHallId = hallId || (await prisma.hall.findFirst({ where: { cinemaId: targetCinemaId } }))?.id;
    if (!targetHallId) {
      return NextResponse.json({ error: "No screen/hall available for selected cinema" }, { status: 400 });
    }

    const existingShowtimes = await prisma.showtime.findMany({
      where: {
        hallId: targetHallId,
      },
      include: { movie: true },
    });

    // Check time collision
    const hasOverlap = existingShowtimes.some((st: any) => {
      const stStart = new Date(st.startTime);
      const stDuration = st.movie?.durationMins || 120;
      const stEnd = new Date(stStart.getTime() + (stDuration + cleanupBufferMins) * 60 * 1000);

      return (start < stEnd && end > stStart);
    });

    if (hasOverlap) {
      return NextResponse.json(
        {
          error: "Schedule Conflict: Screen is already reserved for another movie session during this time window.",
        },
        { status: 409 }
      );
    }

    // Schedule Showtime
    const newShowtime = await prisma.showtime.create({
      data: {
        movieId,
        cinemaId: targetCinemaId,
        hallId: targetHallId,
        startTime: start,
        format,
        basePrice: Number(basePrice),
      },
      include: {
        movie: true,
        cinema: true,
        hall: true,
      },
    });

    return NextResponse.json(newShowtime, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to schedule showtime" }, { status: 500 });
  }
}
